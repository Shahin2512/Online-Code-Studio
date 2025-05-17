# backend/run_code.py
import subprocess
import uuid
import os

def execute_code(code: str, language: str) -> str:
    filename = f"temp/{uuid.uuid4()}"
    ext_map = {
        "python": ".py",
        "java": ".java",
        "c": ".c",
        "cpp": ".cpp"
    }

    ext = ext_map.get(language.lower())
    if not ext:
        raise Exception("Unsupported language")

    os.makedirs("temp", exist_ok=True)
    file_path = filename + ext

    with open(file_path, "w") as f:
        f.write(code)

    try:
        if language == "python":
            result = subprocess.run(["python3", file_path], capture_output=True, text=True, timeout=5)
        elif language == "java":
            compile = subprocess.run(["javac", file_path], capture_output=True, text=True)
            if compile.returncode != 0:
                return compile.stderr
            result = subprocess.run(["java", "-cp", "temp", os.path.basename(filename)], capture_output=True, text=True, timeout=5)
        elif language == "c":
            executable = filename
            compile = subprocess.run(["gcc", file_path, "-o", executable], capture_output=True, text=True)
            if compile.returncode != 0:
                return compile.stderr
            result = subprocess.run([executable], capture_output=True, text=True, timeout=5)
        elif language == "cpp":
            executable = filename
            compile = subprocess.run(["g++", file_path, "-o", executable], capture_output=True, text=True)
            if compile.returncode != 0:
                return compile.stderr
            result = subprocess.run([executable], capture_output=True, text=True, timeout=5)
        else:
            raise Exception("Unsupported language")

        return result.stdout + result.stderr

    finally:
        for f in os.listdir("temp"):
            os.remove(os.path.join("temp", f))