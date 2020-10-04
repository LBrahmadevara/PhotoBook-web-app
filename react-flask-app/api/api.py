import time
from flask import Flask, request
import os
from google.cloud import storage

app = Flask(__name__)

CLOUD_STORAGE_BUCKET = os.environ['CLOUD_STORAGE_BUCKET']
Service_key = os.environ['GOOGLE_APPLICATION_CREDENTIALS']

@app.route('/upload', methods=['POST'])
def demo():
    uploaded_file=request.files.get('file')

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

    return blob.public_url

# @app.route('/time')
# def get_current_time():
#     return {'time': time.time()}

