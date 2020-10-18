import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({Component, pageProps, currentuser}) => {
    return (<div>
            <Header currentuser= {currentuser}/>
            <div className="container">
                <Component currentuser={currentuser} {...pageProps} /> 
            </div>
        </div>);
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    //console.log('From All ' + data);

    //calling getInitialProps of the component
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentuser);
    }

    //console.log('From Component ' + pageProps);
    
    return {
        pageProps,
        ...data
        //currentuser: data.currentuser
    }

};

export default AppComponent;