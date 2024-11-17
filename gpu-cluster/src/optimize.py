# gpu-cluster/src/optimize.py

import tensorflow as tf

# Load the existing model
model = tf.keras.models.load_model('models/full_model.h5')

# Convert the model to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save the optimized model
with open('models/lightweight_model.tflite', 'wb') as f:
    f.write(tflite_model)

print("Model converted to TensorFlow Lite successfully.")
