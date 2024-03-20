import pandas as pd
from moviepy.editor import VideoFileClip
import os

# Load the dataset
csv_file_path = 'how2sign_train.csv'  # Update this path to your CSV file
data = pd.read_csv(csv_file_path, delimiter='\t')  # Ensure delimiter matches your CSV format

# # Paths configuration
# video_dir = 'D:/Project/train_raw_videos/raw_videos'  # Directory where original videos are stored
# output_dir = './extracted_segments'  # Directory for saving extracted segments

# # Ensure output directory exists
# if not os.path.exists(output_dir):
#     os.makedirs(output_dir)

# # Function to process and extract video segments
# def process_video_segment(index, row):
#     video_file_name = f"{row['VIDEO_NAME']}.mp4"
#     video_path = os.path.join(video_dir, video_file_name)
#     output_file = os.path.join(output_dir, f"segment_{index}.mp4")

#     # Load the video file and extract the segment
#     try:
#         with VideoFileClip(video_path) as video:
#             # Check if the start time is within the video duration
#             if row['START'] < video.duration:
#                 # Ensure the end time does not exceed the video's duration
#                 end_time = min(row['END'], video.duration)
#                 segment = video.subclip(row['START'], end_time)
#                 segment.write_videofile(output_file, codec='libx264', audio_codec='aac')
#                 print(f"Processed segment {index+1}/{len(data)}")
#             else:
#                 print(f"Segment {index+1} start time exceeds video duration. Skipping.")
#     except Exception as e:
#         print(f"Error processing segment {index+1}: {e}")

# last_processed_index = 3999  # The last segment you processed

# # Process each video segment, starting from the last processed index + 1
# for index, row in data.iterrows():
#     if index < last_processed_index:
#         continue  # Skip previously processed segments
    
#     process_video_segment(index, row)
    
    


# print("All segments have been processed.")

from sklearn.model_selection import train_test_split

# Assuming the presence of a 'label' column that you might need to create or derive from 'SENTENCE'
X = data[['VIDEO_NAME', 'START', 'END']]  # Features include video name and segment timings
y = data['SENTENCE']  # Labels

# Split data: 70% training, 15% validation, 15% test
X_train_val, X_test, y_train_val, y_test = train_test_split(X, y, test_size=0.15, stratify=y, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_train_val, y_train_val, test_size=0.176, stratify=y_train_val, random_state=42)

# Note: You may need to further process these splits to extract actual video segments or features based on 'VIDEO_NAME', 'START', and 'END'.

