# Use an official Python runtime as a parent image
FROM node

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install 
RUN npm install

# Make port 3333 available to the world outside this container
EXPOSE 3333

# Run app.py when the container launches
CMD ["npm", "start"]