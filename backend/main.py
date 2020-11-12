import time
from flask import Flask, request, make_response, jsonify
from pprint import pprint
import os
import json
from google.cloud import storage
from google.cloud import vision
from google.cloud import datastore
import dialogflow
from datetime import datetime
from flask_cors import CORS, cross_origin
import requests
import wget

app = Flask(__name__)
cors = CORS(app, resources={r"/" : {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
TELEGRAM_BASE_URL = 'https://api.telegram.org/bot1459894487:AAFOhqu1AOc_DvCpWQM4VAZbHsknigLOgjc'
TELEGRAM_FILE_URL = 'https://api.telegram.org/file/bot1459894487:AAFOhqu1AOc_DvCpWQM4VAZbHsknigLOgjc'

CLOUD_STORAGE_BUCKET = "robotic-charmer-291501"
Service_key = os.environ['GOOGLE_APPLICATION_CREDENTIALS']
CLOUD_PROJECT = "robotic-charmer-291501"

datastore_client = datastore.Client(CLOUD_PROJECT)

project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
file_name = None
img_label = None

#@app.route('/')
#def main():
 #   return "main"
def detect_intent_texts(project_id, session_id, text, language_code):
    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(project_id, session_id)

    if text:
        text_input = dialogflow.types.TextInput(
            text=text, language_code=language_code)
        query_input = dialogflow.types.QueryInput(text=text_input)
        response = session_client.detect_intent(
            session=session, query_input=query_input)
        pprint(response.query_result)
        return response.query_result.fulfillment_text

@app.route('/telegram', methods=['POST'])
def telegram():
    print("Got an update from telegram")
    x = request.get_json()
    chat_id = x['message']['chat']['id']
    print(chat_id)
    if 'photo' in x['message'].keys():
        text="This is a file"
        file_id = x['message']['photo'][0]['file_id']
        get_file_url = "{}/getFile?file_id={}".format(TELEGRAM_BASE_URL, file_id)

        get_file_response = requests.post(get_file_url)
        file_path = json.loads(get_file_response.text)["result"]["file_path"]
        file_path_request_url = "{}/{}".format(TELEGRAM_FILE_URL, file_path)
        r = requests.get(file_path_request_url, allow_redirects=True)
        print("Saving image to local directory")
        open('/Users/pavan/Downloads/{}'.format(file_path), 'wb').write(r.content)

        gcs = storage.Client()

        # Get the bucket that the file will be uploaded to.
        bucket = gcs.get_bucket(CLOUD_STORAGE_BUCKET)

        # Create a new blob and upload the file's content.
        blob = bucket.blob(file_path.split('/')[1])

        blob.upload_from_filename('/Users/pavan/Downloads/{}'.format(file_path))

        # Make the blob publicly viewable.
        blob.make_public()
        img_url = blob.public_url
        img_name = "file is " + blob.name
        print("Uploaded image to Google Storage Bucket")
        print(img_name, img_url)

        print("Sending request to DialogFlow")
        response = detect_intent_texts(project_id, "unique", img_name, 'en')
        response_type = response.split("::")[0] if "::" in response else "text"
        fulfillment_text = response.split("::")[1] if "::" in response else response
        if response_type == "text":
            send_message_url = "{}/sendMessage?chat_id={}&text={}".format(TELEGRAM_BASE_URL, chat_id, fulfillment_text)
            resp = requests.post(send_message_url)
        elif response_type == "photo":
            photos = fulfillment_text.split(",")
            for photo_url in photos:
                send_photo_url = "{}/sendPhoto?chat_id={}&photo={}".format(TELEGRAM_BASE_URL, chat_id, photo_url)
                resp = requests.post(send_photo_url)

    elif 'text' in x['message'].keys():
        text= x['message']['text']
        response = detect_intent_texts(project_id, "unique", text, 'en')
        response_type = response.split("::")[0] if "::" in response else "text"
        fulfillment_text = response.split("::")[1] if "::" in response else response
        if response_type == "text":
            send_message_url = "{}/sendMessage?chat_id={}&text={}".format(TELEGRAM_BASE_URL, chat_id, fulfillment_text)
            resp = requests.post(send_message_url)
        elif response_type == "photo":
            photos = fulfillment_text.split(",")
            for photo_url in photos:
                send_photo_url = "{}/sendPhoto?chat_id={}&photo={}".format(TELEGRAM_BASE_URL, chat_id, photo_url)
                resp = requests.post(send_photo_url)

    return jsonify({"status": "Ok"})


# @app.route('/send_message', methods=['POST'])
# @cross_origin()
# def send_message():
#     # message = request.get_json()['message']
#     message = request.files.get('file')
#     print(message)
#     project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
#     fulfillment_text = detect_intent_texts(project_id, "unique", message, 'en')
#     response_text = { "message":  "fulfillment_text" }
#     print(response_text)
#     return jsonify(response_text)


@app.route('/webhook', methods=['POST'])
def webhook():
    print("DialogFlow called webhook")
    data = request.get_json(silent=True)
    # pprint(data)
    global file_name
    global img_label

    if "file is " in data['queryResult']['queryText']:
        file_name = data['queryResult']['queryText'].split("file is ")[1]
        # Instantiates a client
        vision_client = vision.ImageAnnotatorClient()
        source_uri = "gs://{}/{}".format(CLOUD_STORAGE_BUCKET, file_name)
        img_url = "https://storage.googleapis.com/robotic-charmer-291501/{}".format(file_name)
        image = vision.Image(source=vision.ImageSource(gcs_image_uri=source_uri))
        # Performs label detection on the image file
        labels = vision_client.label_detection(image=image).label_annotations
        img_label = labels[0].description
        response = "Uploaded file belongs to " + img_label + " category.\n"

        query = datastore_client.query(kind='Photo Book')
        query.add_filter('category', '=', img_label)
        res = list(query.fetch())
        print(res)
        if len(res) > 0:
            response += "Your PhotoBook already have a photo in this category. Do you want to add it anyways?"
        else:
            response += "Your PhotoBook doesn't have a photo in this category. Do you want to add it now.?"

        reply = {
            "fulfillmentText": "text::{}".format(response)
        }
        print("Sending response to DialogFlow")
    elif "action" in data["queryResult"] and data["queryResult"]["action"] == "Filenames.Filenames-yes":
        img_url = "https://storage.googleapis.com/robotic-charmer-291501/{}".format(file_name)
        key = datastore_client.key('Photo Book')
        entity = datastore.Entity(key=key)
        entity.update({
            'url': img_url,
            'img_name': file_name,
            'category': img_label
        })
        datastore_client.put(entity)
        print("Added image to datastore")
        reply = {
            "fulfillmentText": "text::Successfully added to your PhotoBook",
        }
    elif data["queryResult"]["intent"]["displayName"] == "ViewPhotos":
        query = datastore_client.query(kind='Photo Book')
        res = list(query.fetch())
        fulfillment_text = ""
        if len(res) > 0:
            skip_comma = True
            for entry in res:
                if not skip_comma:
                    fulfillment_text += ","
                fulfillment_text += entry["url"]
                skip_comma = False
            fulfillment_text = "photo::{}".format(fulfillment_text)
        else:
            fulfillment_text = "text::We don't have any photos"
        reply = {
            "fulfillmentText": fulfillment_text,
        }
    else:
        reply = {
            "fulfillmentText": "text::This is not a file",
        }
    return jsonify(reply)

    # elif data['queryResult']['queryText'] == 'no':
    #     reply = {
    #         "fulfillmentText": "Ok. What do you want to do?.",
    #     }
    #     return jsonify(reply)


@app.route('/fileupload', methods=["POST"])
@cross_origin()
def fileupload():
    uploaded_file = request.files.get('file')

    gcs = storage.Client()

    # Get the bucket that the file will be uploaded to.
    bucket = gcs.get_bucket(CLOUD_STORAGE_BUCKET)

    # Create a new blob and upload the file's content.
    blob = bucket.blob(uploaded_file.filename)

    blob.upload_from_string(
        uploaded_file.read(),
        content_type=uploaded_file.content_type
    )

    # Make the blob publicly viewable.
    blob.make_public()
    # print(blob.name)
    url = blob.public_url

    img_name = "file is" + blob.name

    source_uri = "gs://{}/{}".format(CLOUD_STORAGE_BUCKET, blob.name)
    image = vision.Image(source=vision.ImageSource(gcs_image_uri=source_uri))

    project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
    fulfillment_text = detect_intent_texts(project_id, "unique", img_name, 'en')
    response_text = { "message":  fulfillment_text }
    print(response_text)
    return jsonify(response_text)


@app.route('/upload', methods=['POST'])
@cross_origin()
def upload():
    uploaded_file = request.files.get('file')
    name = request.form.get('name')
    loc = request.form.get('loc')
    date = request.form.get('date')
    id = request.form.get('id')
    file_changed = request.form.get('fileChanged')
    old_url = request.form.get('file')
    img_name = request.form.get('img_name')
    edit = request.form.get('edit')

    # Instantiates a client
    vision_client = vision.ImageAnnotatorClient()

    if (file_changed == 'true'):
        # Create a Cloud Storage client.
        gcs = storage.Client()

        if (edit == 'true'):
            delete_bucket = gcs.bucket(CLOUD_STORAGE_BUCKET)
            del_blob = delete_bucket.blob(img_name)
            del_blob.delete()

        # Get the bucket that the file will be uploaded to.
        bucket = gcs.get_bucket(CLOUD_STORAGE_BUCKET)

        # Create a new blob and upload the file's content.
        blob = bucket.blob(uploaded_file.filename)

        blob.upload_from_string(
            uploaded_file.read(),
            content_type=uploaded_file.content_type
        )

        # Make the blob publicly viewable.
        blob.make_public()
        # print(blob.name)
        url = blob.public_url

        img_name = blob.name

        source_uri = "gs://{}/{}".format(CLOUD_STORAGE_BUCKET, blob.name)
        # image = vision.Image(source=vision.ImageSource(gcs_image_uri=source_uri))
        image = vision.Image(source=vision.ImageSource(image_uri="https://api.telegram.org/file/bot1459894487:AAFOhqu1AOc_DvCpWQM4VAZbHsknigLOgjc/photos/file_0.jpg"))

        # Performs label detection on the image file
        labels = vision_client.label_detection(image=image).label_annotations
        for label in labels:
            print(label)

        category = ''
        for label in labels:
            if 'human' == label.description.lower():
                category = 'People'
                break
            elif ('dog' == label.description.lower()) or ('cat' == label.description.lower()) or ('mammal' == label.description.lower()):
                category = 'Animal'
                break
            elif 'flower' == label.description.lower():
                category = 'Flower'
                break
            else:
                category = 'Others'
    else:
        url = old_url
        category = request.form.get('label')

    key = datastore_client.key('Photo Book', id)
    entity = datastore.Entity(key=key)
    entity.update({
        'name': name,
        'location': loc,
        'date': date,
        'url': url,
        'category': category,
        'id': id,
        'img_name': img_name
    })

    datastore_client.put(entity)

    return {'response': 'res'}


@app.route('/all')
@cross_origin()
def all_categories():
    query = datastore_client.query(kind='Photo Book')
    res = list(query.fetch())
    return {'response': res}


@app.route('/delete', methods=['POST'])
@cross_origin()
def delete():
    id = request.get_json()['id']
    query = datastore_client.query(kind='Photo Book')
    query.add_filter('id', '=', id)
    res = list(query.fetch())
    img_name = res[0]['img_name']

    gcs = storage.Client()
    delete_bucket = gcs.bucket(CLOUD_STORAGE_BUCKET)
    del_blob = delete_bucket.blob(img_name)
    del_blob.delete()

    key = datastore_client.key('Photo Book', id)
    datastore_client.delete(key)
    # res = datastore_client.get(key)
    return {'response': "success"}


@app.route('/edit', methods=['POST'])
@cross_origin()
def edit():
    id = request.get_json()['id']
    query = datastore_client.query(kind='Photo Book')
    query.add_filter('id', '=', id)
    res = list(query.fetch())
    return {'response': res}


@app.route('/labels', methods=['POST'])
@cross_origin()
def categories():
    label = request.get_json()['label']
    query = datastore_client.query(kind='Photo Book')
    query.add_filter('category', '=', label)
    res = list(query.fetch())
    return {'response': res}


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
