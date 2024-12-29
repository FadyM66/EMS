import fetcher from './fetcher.js';

export const getData = async (url, { setData, setDataState }) => {
    try {
        setDataState('Loading...');
        const { response, data } = await fetcher(url, 'GET');

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