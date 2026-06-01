📤

📖

🛠

🔍

📚

📋

🎯

⏰

← Back to Course Home

◐

Problem Set #1

Due: June 12, 2026 • 23:55

Building a Creative HTTP Server with Node.js net
Module

Design and implement an HTTP server from scratch using Node.js's low-level  net  module. Your goal is

to create the most creative, elegant, and developer-friendly API possible.

 The Challenge

Modern web frameworks like Express provide convenient APIs for handling HTTP requests. But how do they actually

work under the hood? In this problem set, you'll build your own HTTP server framework from the ground up.

Your mission: Create a unique, creative API that makes it easy and enjoyable for developers to build web applications.

Think about what makes Express great, then surprise us with your own innovative approach!

 Requirements

→

→

→

→

→

Use only the  net  module – No  http ,  http2 , or third-party HTTP libraries

Parse HTTP/1.1 requests manually – Handle request line, headers, and body

Generate valid HTTP/1.1 responses – Status line, headers, and body

Implement a routing system – Match paths and HTTP methods

Support at least:

•

•

Static Ple serving (like  express.static() )

Route handlers (like  app.get() ,  app.post() )

→

Be creative! – Design an API that's fun to use

 Understanding the Building Blocks

The Node.js net Module

The  net  module provides an asynchronous network API for creating TCP servers and clients. Here's how it works:

const net = require('net');

// Create a TCP server

const server = net.createServer((socket) => {

  // 'socket' is a duplex stream representing the connection

  // Receive data from client

  socket.on('data', (data) => {

    console.log('Received:', data.toString());

    // Send data back to client

    socket.write('Hello from server!\n');

  });

  // Handle connection close

  socket.on('end', () => {

    console.log('Client disconnected');

  });

  // Handle errors

  socket.on('error', (err) => {

    console.error('Socket error:', err.message);

  });

});

// Start listening on port 3000

server.listen(3000, () => {

  console.log('Server listening on port 3000');

});

Key socket methods:

→

→

→

→

→

socket.write(data)  – Send data to the client

socket.end([data])  – Close the connection (optionally sending Cnal data)

socket.on('data', callback)  – Listen for incoming data

socket.on('end', callback)  – Called when client closes connection

socket.on('error', callback)  – Handle connection errors

HTTP/1.1 Request Format

An HTTP request is just text with a speciCc format. Here's what your server will receive:

GET /api/users?page=1 HTTP/1.1

Host: localhost:3000

User-Agent: Mozilla/5.0

Accept: application/json

Content-Type: application/json

Content-Length: 27

{"username":"john_doe"}

Let's break this down:

→

→

→

→

Request Line:  METHOD PATH HTTP/VERSION

Headers: Key-value pairs, one per line

Empty Line:  \r\n\r\n  separates headers from body

Body: Optional, used with POST/PUT/PATCH

Parsing example:

function parseRequest(rawData) {

  const request = rawData.toString();

  // Split headers and body (separated by double CRLF)

  const [headerSection, body] = request.split('\r\n\r\n');

  const lines = headerSection.split('\r\n');

  // Parse request line (first line)

  const [method, fullPath, version] = lines[0].split(' ');

  // Parse URL and query string

  const [path, queryString] = fullPath.split('?');

  const query = {};

  if (queryString) {

    queryString.split('&').forEach(param => {

      const [key, value] = param.split('=');

      query[decodeURIComponent(key)] = decodeURIComponent(value || '');

    });

  }

  // Parse headers

  const headers = {};

  for (let i = 1; i < lines.length; i++) {

    const colonIndex = lines[i].indexOf(':');

    if (colonIndex > 0) {

      const key = lines[i].slice(0, colonIndex).toLowerCase().trim();

      const value = lines[i].slice(colonIndex + 1).trim();

      headers[key] = value;

    }

  }

  return { method, path, query, headers, body, version };

}

HTTP/1.1 Response Format

Your server needs to send properly formatted responses:

HTTP/1.1 200 OK

Content-Type: application/json

Content-Length: 42

Connection: close

{"message":"Hello!","status":"success"}

Building a response:

function buildResponse(statusCode, statusText, headers, body) {

  // Status line

  let response = `HTTP/1.1 ${statusCode} ${statusText}\r\n`;

  // Add Content-Length if we have a body

  if (body) {

    headers['Content-Length'] = Buffer.byteLength(body);

  }

  // Add headers

  for (const [key, value] of Object.entries(headers)) {

    response += `${key}: ${value}\r\n`;

  }

  // Empty line + body

  response += '\r\n';

  if (body) {

    response += body;

  }

  return response;

}

// Usage

const body = JSON.stringify({ message: 'Hello!' });

const response = buildResponse(200, 'OK', {

  'Content-Type': 'application/json',

  'Connection': 'close'

}, body);

socket.end(response);

Common status codes to support:

→

→

→

→

→

200 OK  – Success

201 Created  – Resource created

400 Bad Request  – Invalid request

404 Not Found  – Resource not found

500 Internal Server Error  – Server error

 How Express Works (For Inspiration)

Express uses a simple, chainable API. Here are some patterns to inspire your design:

Basic Express Server

const express = require('express');

const app = express();

// Middleware to parse JSON bodies

app.use(express.json());

// Route handler - GET request

app.get('/api/users', (req, res) => {

  res.json([

    { id: 1, name: 'Alice' },

    { id: 2, name: 'Bob' }

  ]);

});

// Route with parameters

app.get('/api/users/:id', (req, res) => {

  const userId = req.params.id;

  res.json({ id: userId, name: 'Alice' });

});

// POST handler

app.post('/api/users', (req, res) => {

  const { name, email } = req.body;

  // Create user...

  res.status(201).json({ id: 3, name, email });

});

// Start server

app.listen(3000, () => {

  console.log('Server running on port 3000');

});

Static File Serving

const express = require('express');

const path = require('path');

const app = express();

// Serve static files from 'public' directory

app.use(express.static('public'));

// With virtual path prefix

app.use('/static', express.static('public'));

// Example: GET /style.css → serves public/style.css

// Example: GET /static/image.png → serves public/image.png

app.listen(3000);

Request Object (req)

app.post('/api/data', (req, res) => {

  // Useful req properties:

  console.log(req.method);      // 'POST'

  console.log(req.path);        // '/api/data'

  console.log(req.query);       // { page: '1' } from ?page=1

  console.log(req.params);      // { id: '123' } from /users/:id

  console.log(req.headers);     // { 'content-type': 'application/json', ... }

  console.log(req.body);        // Parsed JSON body

});

Response Object (res)

app.get('/example', (req, res) => {

  // Set status code

  res.status(404);

  // Set headers

  res.set('X-Custom-Header', 'value');

  // Send responses

  res.send('Plain text');           // text/plain

  res.json({ data: 'value' });      // application/json

  res.sendFile('/path/to/file');    // File with correct MIME type

  // Chaining

  res.status(201).json({ created: true });

});

 Required Implementation: Examples

Below are examples of the two features you must implement. Your API can look diKerent, but should provide similar

functionality.

Example 1: Static File Server

Implement functionality to serve static Cles from a directory:

const net = require('net');

const fs = require('fs');

const path = require('path');

// MIME type mapping

const MIME_TYPES = {

  '.html': 'text/html',

  '.css': 'text/css',

  '.js': 'application/javascript',

  '.json': 'application/json',

  '.png': 'image/png',

  '.jpg': 'image/jpeg',

  '.gif': 'image/gif',

  '.svg': 'image/svg+xml',

  '.ico': 'image/x-icon'

};

function getMimeType(filePath) {

  const ext = path.extname(filePath).toLowerCase();

  return MIME_TYPES[ext] || 'application/octet-stream';

}

function serveStatic(staticDir) {

  return function(req, socket) {

    // Build full file path

    const filePath = path.join(staticDir, req.path);

    // Security: prevent directory traversal attacks

    const resolvedPath = path.resolve(filePath);

    const resolvedDir = path.resolve(staticDir);

    if (!resolvedPath.startsWith(resolvedDir)) {

      sendResponse(socket, 403, 'Forbidden', {}, 'Access denied');

      return;

    }

    // Check if file exists

    fs.stat(filePath, (err, stats) => {

      if (err || !stats.isFile()) {

        sendResponse(socket, 404, 'Not Found', {}, 'File not found');

        return;

      }

      // Serve the file

      const mimeType = getMimeType(filePath);

      const headers = {

        'Content-Type': mimeType,

        'Content-Length': stats.size

      };

      // Send headers first

      let response = `HTTP/1.1 200 OK\r\n`;

      for (const [key, value] of Object.entries(headers)) {

        response += `${key}: ${value}\r\n`;

      }

      response += '\r\n';

      socket.write(response);

      // Stream file content

      const readStream = fs.createReadStream(filePath);

      readStream.pipe(socket);

    });

  };

}

// Usage in your server:

// const staticHandler = serveStatic('./public');

// if (req.path.startsWith('/static')) {

//   staticHandler(req, socket);

// }

Example 2: Route Handler (POST method)

Implement a routing system with method-speciCc handlers:

const net = require('net');

// Simple router implementation

function createRouter() {

  const routes = {

    GET: [],

    POST: [],

    PUT: [],

    DELETE: []

  };

  // Add a route

  function addRoute(method, path, handler) {

    // Convert path pattern to regex (handle :params)

    const paramNames = [];

    const regexPath = path.replace(/:([^/]+)/g, (_, paramName) => {

      paramNames.push(paramName);

      return '([^/]+)';

    });

    routes[method].push({

      regex: new RegExp(`^${regexPath}$`),

      paramNames,

      handler

    });

  }

  // Match a request to a route

  function match(method, path) {

    const methodRoutes = routes[method] || [];

    for (const route of methodRoutes) {

      const match = path.match(route.regex);

      if (match) {

        // Extract params

        const params = {};

        route.paramNames.forEach((name, index) => {

          params[name] = match[index + 1];

        });

        return { handler: route.handler, params };

      }

    }

    return null;

  }

  return {

    get: (path, handler) => addRoute('GET', path, handler),

    post: (path, handler) => addRoute('POST', path, handler),

    put: (path, handler) => addRoute('PUT', path, handler),

    delete: (path, handler) => addRoute('DELETE', path, handler),

    match

  };

}

// Create response helpers

function createResponse(socket) {

  let statusCode = 200;

  let statusText = 'OK';

  const headers = {};

  return {

    status(code) {

      statusCode = code;

      const statusTexts = {

        200: 'OK', 201: 'Created', 400: 'Bad Request',

        404: 'Not Found', 500: 'Internal Server Error'

      };

      statusText = statusTexts[code] || 'Unknown';

      return this;

    },

    set(key, value) {

      headers[key] = value;

      return this;

    },

    json(data) {

      const body = JSON.stringify(data);

      headers['Content-Type'] = 'application/json';

      headers['Content-Length'] = Buffer.byteLength(body);

      let response = `HTTP/1.1 ${statusCode} ${statusText}\r\n`;

      for (const [k, v] of Object.entries(headers)) {

        response += `${k}: ${v}\r\n`;

      }

      response += '\r\n' + body;

      socket.end(response);

    },

    send(text) {

      headers['Content-Type'] = 'text/plain';

      headers['Content-Length'] = Buffer.byteLength(text);

      let response = `HTTP/1.1 ${statusCode} ${statusText}\r\n`;

      for (const [k, v] of Object.entries(headers)) {

        response += `${k}: ${v}\r\n`;

      }

      response += '\r\n' + text;

      socket.end(response);

    }

  };

}

// Complete server example

const router = createRouter();

// Define routes

router.get('/api/hello', (req, res) => {

  res.json({ message: 'Hello, World!' });

});

router.post('/api/users', (req, res) => {

  // req.body contains parsed JSON

  const { name, email } = req.body;

  res.status(201).json({

    id: Date.now(),

    name,

    email,

    created: true

  });

});

router.get('/api/users/:id', (req, res) => {

  const userId = req.params.id;

  res.json({ id: userId, name: 'User ' + userId });

});

// Create server

const server = net.createServer((socket) => {

  socket.on('data', (data) => {

    const req = parseRequest(data);

    const res = createResponse(socket);

    // Try to match route

    const matched = router.match(req.method, req.path);

    if (matched) {

      req.params = matched.params;

      matched.handler(req, res);

    } else {

      res.status(404).json({ error: 'Not Found' });

    }

  });

});

server.listen(3000, () => {

  console.log('Server running on http://localhost:3000');

});

 Reading Materials

HTTP PROTOCOL

Course Lecture: HTTP & The Browser

MDN: HTTP Overview

HTTP/1.1 Tutorial (TutorialsPoint)

RFC 2616 - HTTP/1.1 SpeciCcation

NODE.JS

Course Lecture: Node.js, Next.js & Async JS

Node.js net Module Documentation

Node.js O\cial Tutorial

Node.js Tutorial for Beginners (freeCodeCamp)

EXPRESS.JS (FOR REFERENCE)

Express.js Getting Started

Express.js Routing Guide

Express.js Static Files

 Submission Guidelines

→

→

→

→

→

Submit your code as a GitHub repository link

Include a  README.md  explaining your API design choices

Provide example usage demonstrating both required features

Include at least one creative/unique feature beyond the requirements

Submit on Moodle: Submit your assignment here

Full Stack Engineering • Ohad Assulin • Reichman University • 2026

↗↗↗↗↗↗↗↗↗