import React, {useState} from 'react'
import './Prod.css'


import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useSensors } from "@dnd-kit/core";
// import { v4 as uuidv4 } from "uuid";

import {
    SortableContext,
    verticalListSortingStrategy,
  } from "@dnd-kit/sortable";

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button, Stack, Collapse } from 'react-bootstrap'
import Variant from '../variants/Variant'

const Prod = ({ id, status, index, task, addDiscount, delProduct, show, setShow, setInputId, pl, delVariant, prod, setProd }) => {

    const [offer, setOffer] = useState(0)

    const [open, setOpen] = useState(false)

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        pointerEvents: transform ? 'none' : 'auto',
    }



    //---- dragable start ----------
    
       
    const getProdPos = (id) => task.variants.findIndex(vr => vr.id === id);

    const handleDragEnd = event => {
        const { active, over } = event;

        if (active.id === over.id) return;

            const originalPos = getProdPos(active.id);
                const newPos = getProdPos(over.id)
                let newVariant = arrayMove(task.variants, originalPos, newPos)

                let newProd = prod.map((ele) => {
                if(ele.id==id)
                {
                    ele.task.variants = newVariant
                }
                    return ele;
                })

            setProd(newProd)
          }
      
          const sensors = useSensors(
              useSensor(PointerSensor),
              useSensor(TouchSensor),
              useSensor(KeyboardSensor),
          )
    
        //---- dragable end ----------


    return (
        <div style={style}>
            <Stack>
                <div className='Prod'>
                    <span ref={setNodeRef} {...attributes} {...listeners}>
                        <b className='d-flex me-2'>
                            <i clasName="bi bi-three-dots-vertical text-secondary fw-bold fs-4" style={{width:"9px"}}></i>
                            <i className="bi bi-three-dots-vertical text-secondary fw-bold fs-4" style={{width:"9px"}}></i>
                        </b>
                    </span>
                    {index + 1}.
                    <div className='d-flex shadow-input w-75 position-relative border px-1' style={{padding:"2px"}}>
                        <input type='text' value={task.title} className='rounded-0 form-control form-control-sm border-0 bg-white' disabled placeholder='Select Product' />
                        <Button onClick={() => { setShow(!show); setInputId(id) }} style={{ right: "5px", top: "5px" }} variant="light" size="sm"><i className="bi bi-pencil-fill text-success"></i></Button>
                    </div>

                    {!status ? (
                        <Button
                            onClick={() => addDiscount(id)}
                            variant="success"
                            className='rounded-0 discount'
                        >
                            Add Discount
                        </Button>
                    ) : (
                        <div className="d-flex gap-1 align-items-center discount">
                                <input
                                    type="text"
                                    placeholder="0"
                                    onChange={(e) => setOffer(e.target.value)}
                                    className="form-control rounded-0 shadow-1 fs-6"
                                />
                                <select
                                    className="form-select rounded-0"
                                    aria-label="Default select example"
                                >
                                    <option>% off</option>
                                    <option >flat off</option>
                                </select>
                        </div>
                    )}
                  
                    {
                        pl>=2 &&
                        <div className="">
                        <span
                            onClick={() => delProduct(id)}
                            className="btn btn-close btn-sm "
                        ></span>
                    </div>
                    }

                </div>
                <div className='ps-5' style={{transform:"translateY(-10px)"}}>
                    <Stack>
                        <div className='text-end px-4'>
                       {(task.variants && task.variants.length > 1) &&
                        (
                            <small
                            onClick={() => setOpen(!open)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open}
                            className='text-primary'
                        >
                            {!open ?
                                 ( 
                                    <span role="button"  ><span className='border-bottom border-primary' >hide variants </span> <i className="bi bi-chevron-down"></i></span>
                                    ) : ( 
                                    <span role="button"  ><span className="border-bottom border-primary">show variants</span> <i className="bi bi-chevron-up"></i></span>
                                )}
                        </small>
                        )  
                       }
                        </div>
                        
                        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                        <Collapse in={open} >
                            <div>
                             <SortableContext items={task.variants || []} strategy={verticalListSortingStrategy}>
                            {
                                task.variants?.map((vr) => (
                                    <Variant key={vr.id} {...vr} delVariant={delVariant} vlength={task.variants.length} pro_id={id} status={status} offer={offer} />
                                ))
                            }
                            </SortableContext>
                            </div>
                            </Collapse>
                            </DndContext>
                    </Stack>
                </div>
            </Stack>

        </div>
    )
}

export default Prod