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

    handleSubmit = async (event) => {
        event.preventDefault();
        if (!this.state.note) {
            alert('Поле "Примечание" является обязательным.');
            return;
        }
        const selectedTypeIdInt = parseInt(this.state.selectedTypeId, 10);

        if (this.state.isUsingBulk) {
            const bulkSerialNumbersArray = this.state.bulkSerialNumbers.split(',');
            try {
                const response = await this.props.createEquipment(selectedTypeIdInt, bulkSerialNumbersArray, this.state.note);
                this.setState({ responseRender: response });
            } catch (error) {

            }
        } else {
            try {
                const response = await this.props.createEquipment(selectedTypeIdInt, this.state.serialNumber, this.state.note);
            } catch (error) {

            }
        }
    };

    // handleSubmit = async (event) => {
    //     event.preventDefault();
    //     if (!this.state.note) {
    //         alert('Поле "Примечание" является обязательным.');
    //         return;
    //     }
    //     const selectedTypeIdInt = parseInt(this.state.selectedTypeId, 10);

    //     if (this.state.isUsingBulk) {
    //         const bulkSerialNumbersArray = this.state.bulkSerialNumbers.split(',');
    //         try {
    //             const response = await this.props.createEquipment(selectedTypeIdInt, bulkSerialNumbersArray, this.state.note);
    //             this.setState({ responseRender: response });
    //         } catch (error) {

    //         }
    //     } else {
    //         try {
    //             const response = await this.props.createEquipment(selectedTypeIdInt, this.state.serialNumber, this.state.note);
    //         } catch (error) {

    //         }
    //     }
    // };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.responseRender !== prevState.responseRender) {
            console.log('пришли ошибки', this.state.responseRender);
        }
    }

    // handleSubmit(event) {
    //     event.preventDefault();

    //     if (!this.state.note) {
    //         alert('Поле "Примечание" является обязательным.');
    //         return;
    //     }

    //     const selectedTypeIdInt = parseInt(this.state.selectedTypeId, 10);

    //     if (this.state.isUsingBulk) {
    //         // Отправка списка серийных номеров
    //         const bulkSerialNumbersArray = this.state.bulkSerialNumbers.split(',');
    //         // const bulkSerialNumbersArray = this.state.bulkSerialNumbers;
    //         //const jsonBulk = JSON.stringify(bulkSerialNumbersArray);
    //         console.log(selectedTypeIdInt);
    //         // console.log(jsonBulk);
    //         console.log(bulkSerialNumbersArray);
    //         console.log(this.state.note)
    //         //this.props.createEquipment(selectedTypeIdInt, jsonBulk, this.state.note);
    //         this.props.createEquipment(selectedTypeIdInt, bulkSerialNumbersArray, this.state.note);
    //     } else {
    //         // Отправка одного серийного номера
    //         this.props.createEquipment(selectedTypeIdInt, this.state.serialNumber, this.state.note);
    //     }
    // }

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
        this.setState({ selectedType, selectedTypeId });
    }

    toggleEquipmentsList() {
        this.setState(prevState => ({ showEquipmentList: !prevState.showEquipmentList }));
    }

    render() {
        console.log('render', this.state.responseRender)
        return (
            <div className="container-create">
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="input-container">
                        <label htmlFor="serial_number">Формат серийного номера:</label>
                        <select id="serial_number_format" onChange={(event) => this.handleSerialNumberFormatChange(event)}>
                            <option value="single">Один серийный номер</option>
                            <option value="bulk">Список серийных номеров</option>
                        </select>
                    </div>

                    {this.state.isUsingBulk ? (
                        <div className="input-container">
                            <label htmlFor="bulk_serial_numbers">Список серийных номеров:</label>
                            <textarea id="bulk_serial_numbers" placeholder="Введите список серийных номеров, разделенных запятыми без пробелов. Пример: AzC@1-3X,AzC@1-3XZ1" value={this.state.bulkSerialNumbers} onChange={(event) => this.handleBulkSerialNumbersChange(event)}></textarea>
                        </div>
                    ) : (
                        <div className="input-container">
                            <label htmlFor="serial_number">Серийный номер:</label>
                            <input type="text" id="serial_number" placeholder="Введите серийный номер" value={this.state.serialNumber} onChange={(event) => this.setState({ serialNumber: event.target.value })} />
                        </div>
                    )}

                    <div className="input-container">
                        <label htmlFor="note">Примечание:</label>
                        <textarea id="note" placeholder="Введите примечание" value={this.state.note} onChange={(event) => this.setState({ note: event.target.value })} required></textarea>
                    </div>

                    <div className="equipment-list-container">
                        <button type="button" onClick={() => this.toggleEquipmentsList()}>Выбрать тип оборудования</button>
                        {this.state.showEquipmentList && (
                            <div className="equipment-list">
                                <select name="equipment_type" onChange={(event) => this.handleEquipmentsSelect(event)}>
                                    {this.props.equipments_type.map((type) => (
                                        <option key={type.id} value={type.id}>{type.type_name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    {this.state.responseRender && (
                        <div className="api-response-container">
                            <div className="errors">
                                <ul>
                                    {this.state.responseRender.errors?.map((error) => (
                                        <li key={error}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="success">
                                <ul>
                                    {this.state.responseRender.success_and_save?.map((success) => (
                                        <li key={success}>{success}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <div className="button-container">
                        <input type="submit" value="Создать" />
                    </div>
                </form>
            </div>
        )
    }

    // render() {
    //     return (
    //         <div className="container">
    //             <form onSubmit={(event) => this.handleSubmit(event)}>
    //                 {/* <input type="text" name="serial_number" placeholder="Введите серийный номер" value={this.state.serialNumber} onChange={(event) => this.setState({ serialNumber: event.target.value })} /> */}

    //                 <div>
    //                     <label>Формат серийного номера:</label>
    //                     <select onChange={(event) => this.handleSerialNumberFormatChange(event)}>
    //                         <option value="single">Один серийный номер</option>
    //                         <option value="bulk">Список серийных номеров</option>
    //                     </select>
    //                 </div>

    //                 {this.state.isUsingBulk ? (
    //                     <textarea name="bulk_serial_numbers" placeholder="Введите список серийных номеров, разделенных запятыми без пробелов. Пример: AzC@1-3X,AzC@1-3XZ1" value={this.state.bulkSerialNumbers} onChange={(event) => this.handleBulkSerialNumbersChange(event)}></textarea>
    //                 ) : (
    //                     <input type="text" name="serial_number" placeholder="Введите серийный номер" value={this.state.serialNumber} onChange={(event) => this.setState({ serialNumber: event.target.value })} />
    //                 )}

    //                 <textarea name="note" placeholder="Примечание" value={this.state.note} onChange={(event) => this.setState({ note: event.target.value })} required></textarea>
    //                 <button type="button" onClick={() => this.toggleEquipmentsList()}>Выбрать тип оборудования</button>
    //                 {this.state.showEquipmentList && (
    //                     <select multiple onChange={(event) => this.handleEquipmentsSelect(event)} >
    //                         {this.props.equipments_type.map((type) => <option key={type.id} value={type.id}>{type.type_name}</option>)}
    //                     </select>
    //                 )}
    //                 <input type="submit" value="Создать" />
    //             </form>
    //         </div>
    //     )
    // }
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