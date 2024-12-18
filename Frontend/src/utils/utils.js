import { object } from 'yup';
import fetcher from './fetcher.js';

export const getData = async (url, { setData, setDataState }) => {
    try {
        setDataState('Loading...');
        // console.log("loading")
        const { response, data } = await fetcher(url, 'GET');
        // console.log("ZZZZZZ")
        // console.log(data)

        if (response.status == 200) {
            if(!Object.keys(data.detail.data).length > 0){
                setDataState("No data to show")
            }
            else{
            setData(data.detail.data);
        }
        } else {
            setDataState('Failed to retrieve data.');
        }
    } catch (error) {
        setDataState('Failed to retrieve data.');
        console.log('Error fetching data:', error);
    }
};