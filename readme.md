# ----- to share secret among services
kubectl create secret generic  jwt-secret --from-literal=JWT_KEY=asdf -n node-ticketing

# for testing
# ------------
npm install --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server

# cretae a folder __test__
# create a test file  <name of the file to test>.text.ts
# after creating the test scripts then run
npm run test
npm run test --runInBand --detectOpenHandles

# initialise npm: Client Service
npm init -y
npm install react react-dom next
npm run dev

npm install bootstrap
npm install axios
# -------------------------
# common npm library
# -------------------------------
npm init -y 

# change nam in package.json and publish
git init
git add .
git commit -m 'first commit'

# npm private registry
https://github.com/verdaccio/docker-examples/tree/master/kubernetes-helm-example
# option 1: 
npm publish --access public 
# option 2:
npm adduser --registry http://npm-registry.bpx-training.info
npm login --registry http://npm-registry.bpx-training.info
npm publish --registry http://npm-registry.bpx-training.info
# #######
npm i typescript -g
tsc --init
npm install typescript del-cli --save-dev
## update package.json  and tsconfig
npm run build

#  always run
git status
git add .
git commit -m 'add config'
npm version patch
npm run build
npm publish --access public
# npm publish --registry http://npm-registry.bpx-training.info

# Install all liberaries used in common files
npm install express express-validator cookie-session jsonwebtoken @types/cookie-session @types/express @types/jsonwebtoken

npm run pub
# to use libreary
npm install @bpx-training/common --registry http://npm-registry.bpx-training.info

npm update @bpx-training/common
npm install @bpx-training/common
# config
npm config set registry http://npm-registry.bpx-training.info --scope=@bpx-training

# Ticker Service
# Ingrease limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
npm run test
# --------

NATS streaming
npm init -y
npm install node-nats-streaming ts-node-dev typescript @types/node
npm install -g typescript
tsc --init

# for dev time
kubectl port-forward natss-deploy-554c56c748-z2hkd 4222:4222 -n node-ticketing

kubectl port-forward natss-deploy-6b45479f4c-qz6sm 8222:8222 -n node-ticketing
192.168.1.59:8222/streaming

## -----
# monitoring:

http://nats-monitor.bpx-training.info/streaming/channelsz?subs=1


# --------
# for concurrency
npm install mongoose-update-if-current

# connecto to mongo shell

kubectl exec -it orders-mongo-deploy-7667bcff-25z7d -n node-ticketing  -- mongo

use tickets;
db.tickets.find({price:100})

use orders;
db.orders.find({price:100})

# for expiration
npm install bull @types/bull

# for payments
npm install stripe
kubectl create secret generic ticketing-stripe-secret -n node-ticketing --from-literal STRIPE_KEY=sk_test_51HdQQ9CVRfokEnd9djPqO3GZJTh7QFFXzBLNOKCHBm5hv3LuyZFgPGfwafU4dWfYAuSBjCqyy56fkTSrGWYtBi2I00ioosgrMR

# thi is used for testing
"token": "tok_visa"  

# for client -checkout
npm install react-stripe-checkout
check https://stripe.com/docs/testing for credit card for testing
visa card for testing 4242424242424242  11/30 123

# CI/CD

1) create local git repo
ticketing>>  git init

2) ticketing>>  create .gitignore
node_modules
.DS_Store

2) ticketing>>  git add .
3) ticketing>> git commit -m 'initial commit'

4) create a matching repository on GITHUB  // not gitlab
   <user/repositoryname>
5) git remote add origin <git link.git>
   after this we should see all code on github

6) 