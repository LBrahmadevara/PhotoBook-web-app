import time
from flask import Flask, request
import os
from google.cloud import storage
from google.cloud import vision
from google.cloud import datastore
from datetime import datetime

app = Flask(__name__)

CLOUD_STORAGE_BUCKET = os.environ['CLOUD_STORAGE_BUCKET']
Service_key = os.environ['GOOGLE_APPLICATION_CREDENTIALS']
CLOUD_PROJECT = os.environ['CLOUD_PROJECT']

datastore_client = datastore.Client(CLOUD_PROJECT)


@app.route('/upload', methods=['POST'])
def upload():
    uploaded_file = request.files.get('file')
    name = request.form.get('name')
    loc = request.form.get('loc')
    date = request.form.get('date')
    id = request.form.get('id')

    # Instantiates a client
    vision_client = vision.ImageAnnotatorClient()

    # Create a Cloud Storage client.
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

    # Use the Cloud Vision client to detect a face for our image.
    source_uri = "gs://{}/{}".format(CLOUD_STORAGE_BUCKET, blob.name)
    image = vision.Image(source=vision.ImageSource(gcs_image_uri=source_uri))

    # Performs label detection on the image file
    labels = vision_client.label_detection(image=image).label_annotations

    category = ''
    for label in labels:
        print(label.description)
        if 'human' == label.description.lower():
            category = 'Human'
            break
        elif ('dog' == label.description.lower()) or ('cat' == label.description.lower()) or ('mammal' == label.description.lower()):
            category = 'Animal'
            break
        elif 'flower' == label.description.lower():
            category = 'Flower'
            break
        else:
            category = 'Others'
            # break
    print(category)

    key = datastore_client.key('Photo Book', id)
    entity = datastore.Entity(key=key)
    entity.update({
        'name': name,
        'location': loc,
        'date': date,
        'url': url,
        'category': category,
        'id': id
    })

    datastore_client.put(entity)

    return {'response': 'res'}


@app.route('/all')
def all_categories():
    query = datastore_client.query(kind='Photo Book')
    res = list(query.fetch())
    return {'response': res}


@app.route('/edit', methods=['POST'])
def edit():
    id = request.get_json()['id']
    query = datastore_client.query(kind='Photo Book')
    query.add_filter('id', '=', id)
    res = list(query.fetch())
    return {'response': res}


@app.route('/labels', methods=['POST'])
def categories():
    label = request.get_json()['label']
    query = datastore_client.query(kind='Photo Book')
    query.add_filter('category', '=', label)
    res = list(query.fetch())
    return {'response': res}

