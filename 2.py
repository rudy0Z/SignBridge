from sklearn.preprocessing import LabelEncoder
import pandas as pd
from moviepy.editor import VideoFileClip
import os

# Load the dataset
csv_file_path = 'how2sign_train.csv'  # Update this path to your CSV file
data = pd.read_csv(csv_file_path, delimiter='\t')  # Ensure delimiter matches your CSV format
label_encoder = LabelEncoder()
encoded_labels = label_encoder.fit_transform(data['SENTENCE'])
data['encoded_labels'] = encoded_labels
print(data[['SENTENCE', 'encoded_labels']].head())
# label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
# print(label_mapping)
