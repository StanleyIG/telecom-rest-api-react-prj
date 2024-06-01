import React from 'react'
//import { withRouter } from 'react-router-dom';


class EquipmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serialNumber: '',
            selectedType: [],
            selectedTypeId: '',
            showEquipmentList: false,
            note: '',
            isUsingBulk: false, // Флаг, указывающий, используется ли массовая отправка
            bulkSerialNumbers: '', // Строка, содержащая список серийных номеров, разделенных запятыми
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.note) {
            alert('Поле "Примечание" является обязательным.');
            return;
        }

        const selectedTypeIdInt = parseInt(this.state.selectedTypeId, 10);

        if (this.state.isUsingBulk) {
            // Отправка списка серийных номеров
            const bulkSerialNumbersArray = this.state.bulkSerialNumbers.split(',');
            // const bulkSerialNumbersArray = this.state.bulkSerialNumbers;
            //const jsonBulk = JSON.stringify(bulkSerialNumbersArray);
            console.log(selectedTypeIdInt);
            // console.log(jsonBulk);
            console.log(bulkSerialNumbersArray);
            console.log(this.state.note)
            //this.props.createEquipment(selectedTypeIdInt, jsonBulk, this.state.note);
            this.props.createEquipment(selectedTypeIdInt, bulkSerialNumbersArray, this.state.note);
        } else {
            // Отправка одного серийного номера
            this.props.createEquipment(selectedTypeIdInt, this.state.serialNumber, this.state.note);
        }
    }

    handleSerialNumberFormatChange(event) {
        if (event.target.value === 'bulk') {
            this.setState({ isUsingBulk: true });
        } else {
            this.setState({ isUsingBulk: false });
        }
    }

    handleBulkSerialNumbersChange(event) {
        this.setState({ bulkSerialNumbers: event.target.value });
    }

    handleEquipmentsSelect(event) {
        const selectedType = Array.from(event.target.selectedOptions, option => option.value);
        const selectedTypeId = event.target.value;
        console.log(selectedType);
        console.log(selectedTypeId);
        this.setState({ selectedType, selectedTypeId });
    }

    toggleEquipmentsList() {
        this.setState(prevState => ({ showEquipmentList: !prevState.showEquipmentList }));
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    {/* <input type="text" name="serial_number" placeholder="Введите серийный номер" value={this.state.serialNumber} onChange={(event) => this.setState({ serialNumber: event.target.value })} /> */}

                    <div>
                        <label>Формат серийного номера:</label>
                        <select onChange={(event) => this.handleSerialNumberFormatChange(event)}>
                            <option value="single">Один серийный номер</option>
                            <option value="bulk">Список серийных номеров</option>
                        </select>
                    </div>

                    {this.state.isUsingBulk ? (
                        <textarea name="bulk_serial_numbers" placeholder="Введите список серийных номеров, разделенных запятыми без пробелов. Пример: AzC@1-3X,AzC@1-3XZ1" value={this.state.bulkSerialNumbers} onChange={(event) => this.handleBulkSerialNumbersChange(event)}></textarea>
                    ) : (
                        <input type="text" name="serial_number" placeholder="Введите серийный номер" value={this.state.serialNumber} onChange={(event) => this.setState({ serialNumber: event.target.value })} />
                    )}

                    <textarea name="note" placeholder="Примечание" value={this.state.note} onChange={(event) => this.setState({ note: event.target.value })} required></textarea>
                    <button type="button" onClick={() => this.toggleEquipmentsList()}>Выбрать тип оборудования</button>
                    {this.state.showEquipmentList && (
                        <select multiple onChange={(event) => this.handleEquipmentsSelect(event)} >
                            {this.props.equipments_type.map((type) => <option key={type.id} value={type.id}>{type.type_name}</option>)}
                        </select>
                    )}
                    <input type="submit" value="Создать" />
                </form>
            </div>
        )
    }
}

export default EquipmentForm;



// class EquipmentForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             serialNumber: '',
//             selectedType: [],
//             selectedTypeId: '',
//             showEquipmentList: false,
//             note: ''
//         };
//     }

//     handleSubmit(event) {
//         const selectedTypeIdInt = parseInt(this.state.selectedTypeId, 10);
//         //const serialNumberJson = JSON.stringify(this.state.serialNumber);
//         console.log(selectedTypeIdInt);
//         console.log(this.state.serialNumber)
//         console.log(this.state.note)
//         this.props.createEquipment(selectedTypeIdInt, this.state.serialNumber, this.state.note)
//         event.preventDefault();
//     }


//     // handleEquipmentsSelect(event) {
//     //     const selectedType = Array.from(event.target.selectedOptions, option => option.value);
//     //     console.log(selectedType);
//     //     this.setState({ selectedType });
//     // }
//     handleEquipmentsSelect(event) {
//         const selectedType = Array.from(event.target.selectedOptions, option => option.value);
//         const selectedTypeId = event.target.value;
//         console.log(selectedType);
//         console.log(selectedTypeId);
//         this.setState({ selectedType, selectedTypeId });
//     }


//     handleEquipmentsSelect2(event) {
//         if (!event.target.selectedOptions) {
//             this.setState({
//                 'equipments_type': []
//             })
//             return;
//         }

//         let equipments_type = []

//         for (let option of event.target.selectedOptions) {
//             equipments_type.push(option.value)
//         }

//         this.setState({
//             'equipments_type': equipments_type
//         })
//         console.log(equipments_type);
//     }

//     toggleEquipmentsList() {
//         this.setState(prevState => ({ showEquipmentList: !prevState.showEquipmentList }));
//     }

//     render() {
//         return (
//             <div className="container">
//                 <form onSubmit={(event) => this.handleSubmit(event)}>
//                     <input type="text" name="serial_number" placeholder="введите серийный номер" value={this.state.serialNumber} onChange={(event) => this.setState({ serialNumber: event.target.value })} />
//                     <textarea name="note" placeholder="примечание" value={this.state.note} onChange={(event) => this.setState({ note: event.target.value })}></textarea>
//                     <button type="button" onClick={() => this.toggleEquipmentsList()}>выбрать тип оборудования</button>
//                     {this.state.showEquipmentList && (
//                         <select multiple onChange={(event) => this.handleEquipmentsSelect(event)} >
//                             {this.props.equipments_type.map((type) => <option key={type.id} value={type.id}>{type.type_name}</option>)}
//                         </select>
//                     )}
//                     <input type="submit" value="Create" />
//                 </form>
//             </div>
//         )
//     }
// }

// export default EquipmentForm;