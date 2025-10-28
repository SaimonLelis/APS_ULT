from pymem import Pymem
from pymem.process import module_from_name

pm = Pymem("ac_client.exe")
base = module_from_name(pm.process_handle, "ac_client.exe").lpBaseOfDll

# Ponteiro primário
ptr1 = pm.read_int(base + 0x195404)

# Endereço final do Pitch
pitch_address = ptr1 + 0x38
pitch = pm.read_float(pitch_address)

print("Pitch:", pitch)
