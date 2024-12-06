from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64

app = Flask(__name__)

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Read the image as a numpy array
    np_img = np.fromstring(file.read(), np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    
    # Image processing with OpenCV (e.g., grayscale conversion)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Encode the processed image back to a base64 string
    _, buffer = cv2.imencode('.jpg', gray)
    encoded_string = base64.b64encode(buffer).decode('utf-8')

    return jsonify({'processed_image': encoded_string})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
