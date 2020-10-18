module.exports = {
    webpackDevMiddleware: config => {
        ////this will try to refresh the page or pull changes  every 300 ms
        //config.watchOptions.poll = 300;
        return config;
    }
};