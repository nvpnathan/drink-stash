# Drink Stash
A little web app for saving and searching for cocktail recipes.

Run it behind an HTTP reverse-proxy for TLS-termination etc. You can run it
from the base image, storing persistent data in a sqlite database in a
mounted volume:

```yaml
version: '3'

services:
    api:
        image: 'gthole/drink-stash:latest'
        restart: 'always'
        environment:
            SECRET_KEY=<yourlongsecretkey>
            ALLOWED_HOSTS=<yourhostname>
        ports:
            - '8000'
        volumes:
            - './data:/data'
```

## Provisioning
Once you've got the server started, add a user and some classic cocktail
recipes to get started with.

```
# Create all the tables
$ docker-compose run --rm api ./manage.py migrate

# Create an admin user
$ docker-compose run --rm api ./manage.py createsuperuser

# Add some recipes to get started with
$ docker-compose run --rm api ./manage.py loaddata classic-cocktails
```


## Development Environment
Install [Docker](https://www.docker.com/products/docker-desktop).

```
# Build the app image
$ docker-compose build api

# Follow the setup instructions in the Provisioning section above

# Start the server
$ docker-compose up

# Run the API unit tests
$ docker-compose run --rm api ./manage.py test drinks
```
