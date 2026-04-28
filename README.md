# Get everything running on Docker
docker build -t eyeriswho/frontend ./frontend
docker build -t eyeriswho/backend ./backend

docker push eyeriswho/frontend
docker push eyeriswho/backend

docker compose up
