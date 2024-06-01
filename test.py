import re


# •	N – цифра от 0 до 9;
# •	A – прописная буква латинского алфавита;
# •	a – строчная буква латинского алфавита;
# •	X – прописная буква латинского алфавита либо цифра от 0 до 9;
# •	Z –символ из списка: “-“, “_”, “@”.

# ZXXXXXZXAa
# pattern = "^Z[A-Z0-9]{5}[A-Z0-9]X[a-z]a$"

# serial_number = "@12345@NXz"

# if re.match(pattern, serial_number):
#     print("Серийный номер соответствует паттерну")
# else:
#     print("Серийный номер не соответствует паттерну")



# def validate_sn_mask(value, mask):
#     # ZXXXXXZXAa
#     # -12345-9Aa
#     #error = None
#     errors = []
#     if value == "qwertyuiop":
#         return ('val', value)
#     if len(value) != len(mask):
#         error = f"серийный номер <{value}> не совпадает по длине с маской"
#         # print(error)
#         errors.append(error)
#         #return ('error', error)
#     for pattern in mask:
#         if pattern == 'N':
#             if not re.match(r'^[0-9]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'A':
#             if not re.match(r'^[A-Z]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'a':
#             if not re.match(r'^[a-z]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'X':
#             if not re.match(r'^[A-Za-z0-9]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'Z':
#             if not re.match(r'^[-_@]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         else:
#             error = f"неизвестный паттерн <{pattern}> в маске"
#             errors.append(pattern)
        
#     pattern_str = ', '.join(pattern for pattern in errors)
#     if errors:
#         return ('errors', f"серийный номер {value} не имеет совпадения с паттерном <{pattern_str}> маски {mask}")
#     else:
#         return ('val', value)
    
# print(validate_sn_mask("@12345@NXz", 'ZXXXXXZXAa'))


def validate_sn_mask(value, mask: str):
    errors = []
    if len(value) != len(mask):
        error = f"серийный номер <{value}> не совпадает по длине с маской"
        errors.append(error)

    for index, char in enumerate(value):
        pattern = mask[index]
        if pattern == 'N' and not char.isdigit():
            errors.append(pattern)
        elif pattern == 'A' and not char.isupper():
            errors.append(pattern)
        elif pattern == 'a' and not char.islower():
            errors.append(pattern)
        elif pattern == 'X' and not char.isdigit() and not char.isupper():
            errors.append(pattern)
        elif pattern == 'Z' and char not in ['-', '_', '@']:
                errors.append(pattern)
        # else:
        #     errors.append(pattern)
            
    pattern_str = ', '.join(pattern for pattern in errors)
    if errors:
        return ('errors', f"серийный номер {value} не совпадает с маской {mask}, {pattern_str}")
    else:
        return ('val', value)

value = "-12345-9Aa"
mask = "ZXXXXXZXAa"
print(validate_sn_mask(value, mask))

# print(validate_sn_mask("@12345@NXz", 'ZXXXXXZXAx'))
