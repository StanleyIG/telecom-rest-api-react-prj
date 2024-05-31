import json
import random
import string


def generate_serial_number(patterns):
    serial_number = ''
    for pattern in patterns:
        if pattern == "N":
            pattern = str(random.randint(0, 9))
        elif pattern == "A":
            pattern = random.choice(string.ascii_uppercase)
        elif pattern == "a":
            pattern = random.choice(string.ascii_lowercase)
        elif pattern == "X":
            pattern = random.choice(
                string.ascii_uppercase + str(random.randint(0, 9)))
        elif pattern == "Z":
            pattern = random.choice(["-", "_", "@"])
        serial_number += pattern
    return serial_number


def generate_mask(patterns):
    serial_number_mask = ''
    for _ in range(10):
        symbol = random.choice(patterns)
        serial_number_mask += symbol
    return serial_number_mask


def create_equipment_fixtures():
    # Список символов для маски серийного номера
    patterns = ["N", "A", "a", "X", "Z"]
    # список типов оборудования
    equipment_types = []
    serial_number_mask_set = set()
    for i in range(1, 11):
        type_name = f"Тип оборудования {i}"
        serial_number_mask = generate_mask(patterns)
        if serial_number_mask in serial_number_mask_set:
            while serial_number_mask in serial_number_mask_set:
                serial_number_mask = generate_mask(patterns)
        serial_number_mask_set.add(serial_number_mask)
        equipment_types.append({
            "model": "telecomapp.EquipmentType",
            #"pk": i,
            "fields": {
                "type_name": type_name,
                "serial_number_mask": serial_number_mask,
            }
        })

    # Список оборудования
    equipments = []
    serial_numbers = set()
    mask_set = set()
    for mask in serial_number_mask_set:
        for i in range(1,  11):
            serial_number = generate_serial_number(mask) 
            # Проверка на уникальность серийного номера
            if serial_number in serial_numbers:
                while serial_number in serial_numbers:
                    serial_number = generate_serial_number(mask)
            serial_numbers.add(serial_number)
            if mask not in mask_set:
                equipments.append({
                    "model": "telecomapp.Equipment",
                    # "pk": i,
                    "fields": {
                        "equipment_type": mask,
                        "serial_number": serial_number,
                        "note": f"Примечание к оборудованию {i}",
                    }
                })
        mask_set.add(mask)

    # сохранение данных в json
    with open("equipment_type_fixtures.json", "w", encoding="utf-8") as f:
        json.dump(equipment_types, f, indent=4, ensure_ascii=False)
    with open("equipment_fixtures.json", "w", encoding="utf-8") as f:
        json.dump(equipments, f, indent=4, ensure_ascii=False)

    return equipment_types, equipments


if __name__ == "__main__":
    create_equipment_fixtures()