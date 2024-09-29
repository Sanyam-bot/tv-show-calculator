# Python base image
FROM python:3.12-alpine

# Copy all the files into container
COPY . /app/

# Set a work directory
WORKDIR /app/

# Installing all the requirements
RUN pip install --no-cache-dir -r requirements.txt

# Setting the environment
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Exposing the port
EXPOSE 5000

# Final Command
CMD [ "flask", "run" ]