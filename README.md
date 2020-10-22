# PhotoBook-web-app

Implement a PhotoBook web application using Google App Engine to manage and automatically label images. Your website will accept images in the following categories: (1) animals, (2) flowers, (3) people, and (4) others.

Your PhotoBook app will have a similar architecture to that of the Bookshelf app, which you are recommended to review first.  (See section 3 below.) You are going to use GCP’s Datastore (a NoSQL database) to store a photo’s meta data including 

- the name of the photographer who took the photo
- location where the photo was taken
- date when the photo was taken
To store the actual photo images, you are going to use GCP’s Cloud Storage.

The web interface will include at least the following three tabs: 

Upload a photo:  where a user can type in the metadata of a photo as described above and then upload the image. After a photo is uploaded, you are going to use Google’s Cloud Vision API to label each photo.  Such labels are then used to organize your photobook into the four categories: (1) animals, (2) flowers, (3) people, and (4) others.
My photobook: which displays uploaded photos in the above four categories.
Manage photos: where a user can edit a photo’s metadata, replace the photo with a new photo, manually correct a photo’s category given by the Vision API, or remove a photo from the photobook.  Remember to call the Cloud Vision API to re-label the replacement image.
