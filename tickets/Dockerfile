FROM node:alpine

WORKDIR /app
COPY package.json .
#RUN npm install @bpx-training/common
#RUN npm install @bpx-training/common --registry http://npm-registry.bpx-training.info
#RUN npm config set registry http://npm-registry.bpx-training.info/ericksap/ --scope=@bpx-training
RUN npm install --only=prod 
COPY . .

CMD ["npm","start"]
