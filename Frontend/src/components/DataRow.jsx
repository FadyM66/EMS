const DataRow = ({data}) => {
    return (
        <>
            <div className='company-container'>
                <div className='company-name'>
                    <h2>{data.name}</h2>
                </div>
                <div className='btn-container'>
                    <button>view</button>
                    <button>edit</button>
                    <button id='delete-btn' onClick={() => handleDelete(data.id)}>delete</button>
                </div>
            </div>
        </>
    )
}

export default DataRow;