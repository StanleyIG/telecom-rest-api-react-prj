import React from 'react'
import { Modal } from 'react-bootstrap';
// import { withRouter } from 'react-router-dom';


class EquipmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serialNumber: '',
            selectedType: [],
            selectedTypeId: '',
            showEquipmentList: false,
            note: '',
            isUsingBulk: false, // флаг, используется ли массовая отправка
            bulkSerialNumbers: '', // список серийных номеров
        };
    }

    handleSubmit = async (event) => {
        const { history } = this.props;
        event.preventDefault();
        if (!this.state.note) {
            alert('Поле "Примечание" является обязательным.');
            return;
        }
        const selectedTypeIdInt = parseInt(this.state.selectedTypeId, 10);

        if (this.state.isUsingBulk) {
            // const bulkSerialNumbersArray = this.state.bulkSerialNumbers.split(',');
            const bulkSerialNumbersArray = this.state.bulkSerialNumbers.replace(/\s/g, '').split(',');
            try {
                const response = await this.props.createEquipment(selectedTypeIdInt, bulkSerialNumbersArray, this.state.note);
                //console.log(bulkSerialNumbersArray)
                this.setState({ responseRender: response });
            } catch (error) {
                if (error.response.status === 403) {
                    alert('Необходимо пройти аутентификацию');
                }

            }
        } else {
            try {
                const response = await this.props.createEquipment(selectedTypeIdInt, this.state.serialNumber, this.state.note);
                this.setState({ responseRender: response });
            } catch (error) {
                if (error.response.status === 403) {
                    alert('Необходимо пройти аутентификацию');
                }

            }
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.responseRender !== prevState.responseRender) {
            console.log('пришли ошибки', this.state.responseRender);
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
        this.setState({ selectedType, selectedTypeId });
        console.log('select', selectedType);
    }

    toggleEquipmentsList() {
        this.setState(prevState => ({ showEquipmentList: !prevState.showEquipmentList }));
    }

    handleClose = () => {
        this.setState({ responseRender: null });
    };


    render() {
        console.log(this.state.responseRender)
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
                            <textarea id="bulk_serial_numbers" placeholder="Введите список серийных номеров разделенных запятыми. Дубликаты будут удалены." value={this.state.bulkSerialNumbers} onChange={(event) => this.handleBulkSerialNumbersChange(event)}></textarea>
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
                        <button type="button" className='btn btn-primary' onClick={() => this.toggleEquipmentsList()}>Выбрать тип оборудования</button>
                        {this.state.showEquipmentList && (
                            <div className="equipment-list">
                                <select name="equipment_type" onChange={(event) => this.handleEquipmentsSelect(event)}>
                                    <option value="" disabled selected>Выберите тип оборудования</option>
                                    {this.props.equipments_type.map((type) => (
                                        <option key={type.id} value={type.id}>{type.type_name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    {this.state.responseRender && (
                        <Modal show={this.state.responseRender} onHide={this.handleClose}>
                            <Modal.Header>
                                <Modal.Title>Ответ сервера</Modal.Title>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.handleClose}></button>
                            </Modal.Header>
                            <Modal.Body style={{maxHeight: '400px', overflowY: 'auto'}}>
                                <div className="errors">
                                    <h4>Не прошли валидацию</h4>
                                    <ul>
                                        {this.state.responseRender.errors?.map((error) => (
                                            <li key={error}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="success">
                                    <h4>Записанные серийные номера</h4>
                                    <ul>
                                        {this.state.responseRender.success_and_save?.map((success) => (
                                            <li key={success}>серийный номер "{success}" совпадает с паттернами маски и был записан</li>
                                        ))}
                                    </ul>
                                </div>
                            </Modal.Body>
                        </Modal>
                    )}
                    <button type='submit' className='btn btn-success'>Создать</button>
                </form>
            </div>
        )
    }
}

export default EquipmentForm;