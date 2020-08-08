import React from 'react';
import { Button } from '@material-ui/core'
import { useFirebase } from '../../../components/FirebaseProvider';

function Home() {
    const { auth } = useFirebase();
    return (
        <React.Fragment>
            <h1>Hello Home</h1>
            <Button onClick={() => auth.signOut()}> SIGN OUT </Button>
        </React.Fragment>
    )
}

export default Home;