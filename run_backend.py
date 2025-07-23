import subprocess
import os

backend_path = r'D:\Rahul\MY CODING WORK\English Learning\backend'

# Change the current working directory to the backend directory
os.chdir(backend_path)

# Run the uvicorn command
subprocess.run(["uvicorn", "main:app", "--reload"])
