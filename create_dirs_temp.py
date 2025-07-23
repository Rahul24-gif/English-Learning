
import os

base_path = r'D:\Rahul\MY CODING WORK\English Learning'
frontend_path = os.path.join(base_path, 'frontend')
backend_path = os.path.join(base_path, 'backend')

os.makedirs(frontend_path, exist_ok=True)
os.makedirs(backend_path, exist_ok=True)

print("Directories created successfully.")
