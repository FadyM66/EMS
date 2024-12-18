import Cookies from 'js-cookie';

const fetcher = async (url, Method, values = {}, login = false) => {
    let token = null;
    let body = null;

    if (!login) {
        token = Cookies.get('token');
    }

    if (Object.keys(values).length > 0) {
        body = JSON.stringify({ data: values });
    }

    try {
        const response = await fetch(url, {
            method: Method,
            headers: {
                "Content-Type": "application/json",
                "token": token || null
            },
            body: body
        });

        let data = null;

        try{
            data = await response.json();
        }
        catch (error) {
            console.log("No Json sent")
        }

        return { response, data };

    } catch (error) {
        
        console.log("error: ", error)
        return { response: null, data: null };
    }
}

export default fetcher;