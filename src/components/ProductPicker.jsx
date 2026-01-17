import { Button, Modal,ListGroup, Stack, Spinner, Form } from 'react-bootstrap'
import React, { useEffect, useState, useRef } from 'react'

import Picker from './picker/Picker';


const ProductPicker = ({ show, setShow, setSelect, handleSelect, handleAdd, select, handleSelectVarent }) => {
    const [search, setSearch] = useState("")
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [hasMore, setHasMore] = useState(true)


    const myRef= useRef(null)
    const abortCtrlRef = useRef(null)
    const lastFetchRef = useRef({ search: null, page: null })
  

    const fetchData = async (searchTerm, pageNum) => {
        // avoid duplicate fetches
        if (lastFetchRef.current.search === searchTerm && lastFetchRef.current.page === pageNum) return

        // abort previous
        if (abortCtrlRef.current) abortCtrlRef.current.abort()
        const controller = new AbortController()
        abortCtrlRef.current = controller

        setLoading(true)
        lastFetchRef.current = { search: searchTerm, page: pageNum }

        try {
            const res = await fetch(
                `https://stageapi.monkcommerce.app/task/products/search?search=${encodeURIComponent(searchTerm)}&page=${pageNum}&limit=10`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': '72njgfa948d9aS7gs5'
                    },
                    signal: controller.signal
                }
            )
            const arr = await res.json()
            setData(prev => pageNum === 1 ? (arr || []) : ([...prev, ...(arr || [])]))
            // if returned items are fewer than limit, no more pages
            setHasMore(Array.isArray(arr) ? (arr.length === 10) : false)
        } catch (err) {
            if (err.name === 'AbortError') return
            console.error(err)
            setError(err)
        } finally {
            setLoading(false)
            if (abortCtrlRef.current === controller) abortCtrlRef.current = null
        }
    }

    // debounce search input
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400)
        return () => clearTimeout(t)
    }, [search])

    // fetch first page when modal opens or debounced search changes
    useEffect(() => {
        if (!show) return
        setPage(1)
        setHasMore(true)
        fetchData(debouncedSearch, 1)
    }, [debouncedSearch, show])

    // fetch subsequent pages when page increments
    useEffect(() => {
        if (!show) return
        if (page === 1) return
        fetchData(debouncedSearch, page)
    }, [page, show, debouncedSearch])


    useEffect(() => {
        if (!show) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry && entry.isIntersecting) {
                observer.unobserve(entry.target)
                // prevent triggering while already loading or when no more pages
                if (!loading && hasMore) {
                    setPage((p) => p + 1)
                }
            }
        })

        const lastImg = document.querySelector('.lastImg:last-child')
        if (lastImg) observer.observe(lastImg)

        return () => {
            if (lastImg) observer.unobserve(lastImg)
            observer.disconnect()
        }
    }, [data, show, loading, hasMore])
  
    
    const handleClose = () => {
        setSearch("");
        setPage(1);
        setSelect([])
        setShow(false);
    }
    

    return (
            <Modal size="lg" show={show} onHide={handleClose} >
                <Modal.Header closeButton className='py-2 px-4'>
                    <Modal.Title className='fs-5' >Select Products</Modal.Title>
                </Modal.Header>
                <Modal.Header className='py-2 px-4'>
                <input placeholder='🔎 search items' onChange={(e) => setSearch(e.target.value)} className='form-control rounded-0 px-4' />
                </Modal.Header>
                
                <Modal.Body className='p-0 overflow-auto' id="scroll"  style={{maxHeight:"70vh"}}>
               
                <ul className='border list-group list-group-flush' >
                {
                    (loading && search) ? (
                            <Spinner animation="border" variant='primary' size="lg" className='my-5 mx-auto' role="status">
                                 <span className="visually-hidden">Loading...</span>
                            </Spinner>
                    ) : error ? 
                        "someting went wrong" :
                    data.map((ele) =>   (
                        <li  key={ele.id} className='p-0 list-group-item lastImg' ref={myRef} >
                            <Stack direction="horizontal" onClick={() => handleSelect(ele)} className='px-3' gap={3}>
                                <div className="py-2">
                                <input
                                    type='checkbox'
                                    checked={select?.some(se => se.id === ele.id)}
                                    readOnly
                                    className='form-check-input checkbox'
                               
                              />
                                </div>
                                <div className="py-2"  >
                                     <img width="40px" height="40px" className='img-fluid rounded-1 overflow-hidden' src={ele.image.src} />
                                </div>
                                <div className="py-2">{ele.title}</div>
                            </Stack>
                            <ListGroup variant="flush" className='border-top p-0'>
                            {
                                ele.variants?.map((el) => (
                                   <Picker key={el.id}  el={el} ele={ele} select={select} handleSelectVarent={handleSelectVarent} />
                                ))
                            }
                               
                            </ListGroup>
                        </li>
                    ))
                }
                {(loading && !search) && (
                    <Spinner animation="border" variant='primary' size="lg" className='my-5 mx-auto' role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    )}  
                </ul>

                </Modal.Body>
                <Modal.Footer>
                <p>{select.length} Product Selected</p>
                    <Button variant="outline-secondary ms-auto" onClick={handleClose} >
                        Cancel
                    </Button>
                    <Button onClick={()=>{setSearch(""); handleAdd()}} variant="success" >
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        
    )
}

export default ProductPicker