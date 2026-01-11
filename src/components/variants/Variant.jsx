import React from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'



const Variant = ({id, title, delVariant, vlength, pro_id}) => {


        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

        const style = {
            transition,
            transform: CSS.Transform.toString(transform),
            pointerEvents: transform ? 'none' : 'auto',
        }
    


  return (
    <div className='Prod' key={id} style={style}>
                                        <span ref={setNodeRef} {...attributes} {...listeners} >
                                            <b className='d-flex me-3'>
                                                <i class="bi bi-three-dots-vertical text-secondary fw-bold fs-4" style={{width:"9px"}}></i>
                                                <i class="bi bi-three-dots-vertical text-secondary fw-bold fs-4" style={{width:"9px"}}></i>
                                            </b>
                                        </span>

                                        <div className='d-flex shadow-input w-75 border position-relative overflow-hidden rounded-pill'>
                                            <input type='text' value={title} className='form-control form-control-sm rounded-0  border-0 bg-white' disabled placeholder='Select Product' style={{fontSize:"12px"}} />
                                        </div>
{/* 
                                        {!status ? (
                                            <div>
                                            
                                            </div>
                                        ) : (
                                            <div className="row g-1 align-items-center">
                                                <div className="col-4">
                                                    <input
                                                        type="text"
                                                        placeholder=""
                                                        value={offer}
                                                        className="form-control rounded-pill shadow-1"
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <select
                                                        className="form-select rounded-pill"
                                                        aria-label="Default select example"
                                                    >
                                                        <option>% off</option>
                                                        <option >flat off</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )} */}
                                        {
                                            vlength>=2 &&
                                            <div className="">
                                            <span
                                                onClick={() => delVariant(pro_id, id)}
                                                className="btn btn-close btn-sm"
                                            ></span>
                                        </div>
                                        }

                                    </div>
  )
}

export default Variant