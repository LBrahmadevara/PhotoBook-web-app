import time
from flask import Flask, request
import os
from google.cloud import storage
from google.cloud import vision

app = Flask(__name__)

CLOUD_STORAGE_BUCKET = os.environ['CLOUD_STORAGE_BUCKET']
Service_key = os.environ['GOOGLE_APPLICATION_CREDENTIALS']

@app.route('/upload', methods=['POST'])
def upload():
    uploaded_file=request.files.get('file')

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

    # Use the Cloud Vision client to detect a face for our image.
    source_uri = "gs://{}/{}".format(CLOUD_STORAGE_BUCKET, blob.name)
    print(source_uri)
    image = vision.Image(source=vision.ImageSource(gcs_image_uri=source_uri))

    # Performs label detection on the image file
    labels = vision_client.label_detection(image=image).label_annotations

    print('Labels:')
    for label in labels:
        print(label.description)
    # print(len(labels))

    return blob.public_url

# @app.route('/time')
# def get_current_time():
#     return {'time': time.time()}

