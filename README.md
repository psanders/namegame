# Name Game Service

> Backend support for the Name Game.

[![publish to docker hub](https://github.com/psanders/namegame/actions/workflows/gh_docker.yml/badge.svg)](https://github.com/psanders/namegame/actions/workflows/gh_docker.yml)

This is an implementation of the Name Game using NodeJS. The service exposes a set of APIs that allows to create the neccesary state and to play with the game.

## Available Versions

You can see all images available to pull from Docker Hub via the [Tags]() page. Docker tag names that begin with a "change type" word such as task, bug, or feature are available for testing and may be removed at any time.

## Installation

You can clone this repository and manually build it.

```
cd psanders/namegame\:%%VERSION%%
docker build -t psanders/namegame:%%VERSION%% .
```

Otherwise, you can pull this image from the docker index.

```
docker pull psanders/namegame:%%VERSION%%
```

## Usage Example

The following is a basic example of using this image.

```bash
docker run -p 3000:3000 namegame 
```

or with Node:

```bash
npm i
npm start
```

## Environment Variables

Environment variables are used in the entry point script to render configuration templates. You can specify the values of these variables during `docker run`, `docker-compose up`, or in Kubernetes manifests in the `env` array.

{Each environment variable might have 1-2 sentences of description. For anything longer, we should probably have a sub-section within Specs to elaborate.}

- `PROFILES_API_URL` - The url with the dataset with all the profiles for the game. **Required**
- `LOGS_LEVEL` - Set to `verbose` to increase the log level.

## Exposed ports

- `3000` - Default application port for HTTP

## Volumes

None

## Useful File Locations

None

## Contributing

Please read [CONTRIBUTING.md](https://github.com/psanders/namegame/blob/master/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests to us.

## Authors

- [Pedro Sanders](https://github.com/psanders)

See the List of contributors who [participated](https://github.com/psanders/namegame/contributors) in this project.

## License

Copyright (C) 2022 by Pedro Sanders. MIT License (see [LICENSE](https://github.com/psanders/namegame/blob/master/LICENSE) for details).
