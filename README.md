# Yo!LOG

**You Log Only Once**

View Opentelemetry logs in comfort of your own browser with advanced
filtering. Aim of this project is to stay simple. No feature overload.

It is aimed at developers integrating OpenTelemetry who want to avoid
manually parsing JSON logs. Standard and colorized console output still
has its place, but dynamic filtering will make inspecting logs easier
and more flexible.

## Features

* View logs within comfort of browser.
* Dynamic filters.
  * Filter by log levels
  * Filters based on incoming log attributes.
* Persist specific preferences across browser restarts.
* Start/ stop visualization.
* Uses a fixed-length log buffer to prevent unbounded memory growth.

### In works

* Format timestamp
* Support timezone conversion
* View all atttributes in detail view.

## Project status: BETA

Core functionality is stable and useful for immediate use.
Some features and edge cases still under development.

## Getting started

This project can be replicated and deployed locally from source. However,
for most users, running the Docker image should the preferred approach due
to its simplicity and minimal configuration requirements.

Get Docker image from: ([hub](https://hub.docker.com/r/spremi/yolog))

### Ports
The container exposes three ports that are required for the application to
function correctly:
* 4200 – Web UI
* 8000 – Backend service
* 4318 – OpenTelemetry log ingestion endpoint

⚠️ Port **4318** is fixed and cannot be changed, as it is used by OpenTelemetry
loggers.

### Running with `docker run`

```sh
docker run --rm -p 4200:4200 -p 8000:8000 -p 4318:4318 yolog-v080

```

Once the Docker image is running, open your browser at
[http://localhost:4200](http://localhost:4200).


## Under the hood

* Log ingestion is handled by a Python service that forwards data to the
  UI using WebSockets.
* UI is built on Angular 19.


## Limitations

* The project will deliberately stay lightweight. It is not intended to
   evolve into a full-featured log viewer.
* As a personal side project, updates shall be incremental rather than frequent.


## License

&copy; 2025, 2026. Sanjeev Premi.

Source available under the terms of BSD-3-Clause license.
