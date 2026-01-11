import React, { useState } from "react";
import { Row, Col, Container } from 'react-bootstrap'
import { v4 as uuidv4 } from "uuid";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useSensors } from "@dnd-kit/core";
import ProductPicker from "./ProductPicker";
import Column from "./column/Column";
import AddProduct from "./AddProduct";


function ProductList() {

    const [show, setShow] = useState(false);
    const [inputId, setInputId] = useState("")
    const [select, setSelect] = useState([])
    const [prod, setProd] = useState([
        { task: {}, status: false, id: uuidv4() },
    ]);


    const handleAdd = () => {
        let newProd = [...prod];
        let index = prod.findIndex((ele) => ele.id == inputId)
        select.forEach((ele) => {
            if (newProd[index]) {
                newProd[index].task = ele
                index++;
            }
            else {
                newProd[index] = { task: ele, status: false, id: uuidv4() }
                index++;
            }
        })
        setProd(newProd)
        setSelect([])
        setShow(!show)
    }

    const handleSelect = (element) => {
        let newSelect = [...select]
        let newId = newSelect.some(ele=> ele.id == element.id)
        newId ? newSelect = newSelect.filter(ele=> ele.id != element.id) : newSelect = [...newSelect, element]
        setSelect(newSelect)
    }

    const handleSelectVarent = (product, variant) => {
        let newSelect = [...select]
          
        let newProduct = newSelect.find(ele=> ele.id == product.id)

        if(newProduct)
        {     
                newProduct.variants.some((el) => el.id==variant.id) 
                    ?
                newProduct.variants = newProduct.variants.filter(el=> el.id != variant.id) 
                    :
                newProduct.variants.push(variant) 
                ;
                
                newSelect = newSelect.map((ele) => ele.id == product.id ? {...ele, variants: newProduct.variants} : ele)
        }
        else
        {
            
            newSelect.push({...product, variants:[variant]})
        }
      
        setSelect(newSelect)
    }

    const delProduct = (id) => {
        const newProd = prod.filter((ele) => ele.id != id);
        setProd(newProd);
    };

    const delVariant = (prod_id, id) => {
        let newProd = prod.find((ele) => ele.id == prod_id)
        newProd.task.variants = newProd.task.variants.filter(el=> el.id!=id)
        let newElements = prod.map((ele) => ele.id==prod_id ? ele=newProd : ele )
        setProd(newElements)
    }

    const addDiscount = (id) => {
        const newProd = prod.map((ele) =>
            ele.id == id ? { ...ele, status: !ele.status } : ele
        );
        setProd(newProd);
        console.log(prod)
    };

    const handleProduct = () => {
        setProd([...prod, { task: {}, status: false, id: uuidv4() }]);
    };



    //---- dragable start ----------

    const getProdPos = id => prod.findIndex(prod => prod.id === id);

    const handleDragEnd = event => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setProd(prod => {
            const originalPos = getProdPos(active.id);
            const newPos = getProdPos(over.id)

            return arrayMove(prod, originalPos, newPos)
        })
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor),
    )

    //---- dragable end ----------
   

    return (


        <div className="App">
            <Container style={{ maxWidth: "768px" }}>
                <Row className=" my-3 ps-5">
                    <Col>
                        <h4>Add Products</h4>
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col>Products</Col>
                    <Col>Discount</Col>
                </Row>
            </Container>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <Column prod={prod} addDiscount={addDiscount} delProduct={delProduct} show={show} setShow={setShow} setInputId={setInputId} delVariant={delVariant} setProd={setProd} />
            </DndContext>

            <AddProduct handleProduct={handleProduct} />

            <ProductPicker show={show} setShow={setShow} handleSelect={handleSelect} handleAdd={handleAdd} select={select} handleSelectVarent={handleSelectVarent} />


        </div>
    );
}

export default ProductList;
