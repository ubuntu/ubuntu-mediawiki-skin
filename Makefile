.PHONY: setup deploy up down clean

setup: LocalSettings.php
	docker compose up -d
	@echo "Waiting for database..."
	@until docker compose exec -T mediawiki bash -c "php -r \"new mysqli('db', 'mediawiki', 'mediawiki', 'mediawiki');\"" > /dev/null 2>&1; do printf '.'; sleep 2; done
	@echo " ready."
	docker compose exec mediawiki php maintenance/run.php install \
		--dbtype mysql --dbserver db --dbname mediawiki \
		--dbuser mediawiki --dbpass mediawiki \
		--pass UbuntuWiki2024! \
		"Ubuntu wiki" admin
	docker compose cp LocalSettings.php mediawiki:/var/www/html/LocalSettings.php
	@echo ""
	@echo "Setup complete!"
	@echo "  URL:      http://localhost:8080"
	@echo "  Username: admin"
	@echo "  Password: UbuntuWiki2024!"

deploy: LocalSettings.php
	docker compose cp LocalSettings.php mediawiki:/var/www/html/LocalSettings.php

up: LocalSettings.php
	docker compose up -d
	docker compose cp LocalSettings.php mediawiki:/var/www/html/LocalSettings.php

down:
	docker compose down

clean:
	docker compose down -v

LocalSettings.php:
	cp LocalSettings.example.php LocalSettings.php
	@echo "Created LocalSettings.php from LocalSettings.example.php — edit it before running setup."
