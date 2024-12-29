import fetcher from "./fetcher";


export const handleDelete = (setSelectedId, setIsOpen, id) => {
    setSelectedId(id)
    setIsOpen('delete')
}

export const handleConfirm = async (url, setDeleting, refreshData, setIsOpen) => {
    try {
        setDeleting("deleting")
        const { response } = await fetcher(
            url,
            "DELETE"
        )

        if (response.status == 200) {
            setIsOpen(null)
            refreshData()
            setDeleting("yes")
        }
    }
    catch (error) {
        console.log(`error: ${error}`)
    }
};

export const handleCancel = (setIsOpen, resetForm) => {
    setIsOpen(null)
    if (resetForm) {
        resetForm()
    }
}

export const handleViewData = async (url, setData) => {
    try {
        const { response, data } = await fetcher(
            url,
            "GET"
        )
        if (response.status == 200) {
            setData(data.data)
        }
        else {
            setData("Something went wrong!")
        }
    }
    catch (error) {
        console.log(`error: ${error}`)
    }
}

export const handleView = async (setIsOpen, setSelectedId, id) => {
    setSelectedId(id)
    setIsOpen('view')
}

export const handleEdit = async (setIsOpen, setEditData, data) => {
    setEditData(data)
    setIsOpen('edit')
}

export const handleUpdate = async (url, values, setIsOpen, refreshData, resetForm) => {
    try {
        const { response, data } = await fetcher(
            url,
            "PATCH",
            values
        )
        if (response.status == 200) {
            setIsOpen(null)
            resetForm()
            refreshData()
        }
    }
    catch (error) {
        console.log(`error: ${error}`)
    }
}

export const handleAccount = async (email) => {

    const { response, data } = await fetcher(`http://localhost:8000/user/?email=${email}`, "GET")

    if (response.status == 200){
        return data
    }
    if (response.status == 404){
        return 404
    }
}