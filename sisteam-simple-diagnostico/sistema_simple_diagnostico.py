# Sistema Simple de Diagnóstico
# El programa calcula P(gripe | Fiebre)

# --- Datos del problema ---
P_Gripe = 0.2        # P(gripe) = 0.2
P_Fiebre_dado_Gripe = 0.85  # P(Fiebre|gripe) = 0.85
P_Fiebre_dado_NoGripe = 0.1  # P(Fiebre|no gripe) = 0.1
P_NoGripe = 1 - P_Gripe  # P(No Gripe) = 0.80no

def calcular_P_gripe_dado_fiebre(tiene_fiebre):
    """
    Calcula P(gripe | Fiebre) usando el teorema de Bayes
    """
    if tiene_fiebre:
        # Calcular P(Fiebre) usando la ley de probabilidad total
        P_Fiebre = (P_Fiebre_dado_Gripe * P_Gripe) + (P_Fiebre_dado_NoGripe * P_NoGripe)
        
        # Aplicar teorema de Bayes: P(gripe | Fiebre)
        # P(gripe | Fiebre) = P(Fiebre | gripe) * P(gripe) / P(Fiebre)
        probabilidad = (P_Fiebre_dado_Gripe * P_Gripe) / P_Fiebre
        
        return probabilidad
    else:
        # Calcular P(No Fiebre | Gripe) y P(No Fiebre | No Gripe)
        P_NoFiebre_dado_Gripe = 1 - P_Fiebre_dado_Gripe  # 1 - 0.85 = 0.15
        P_NoFiebre_dado_NoGripe = 1 - P_Fiebre_dado_NoGripe  # 1 - 0.10 = 0.90
        
        # Calcular P(No Fiebre) usando la ley de probabilidad total
        P_NoFiebre = (P_NoFiebre_dado_Gripe * P_Gripe) + (P_NoFiebre_dado_NoGripe * P_NoGripe)
        
        # Aplicar teorema de Bayes: P(gripe | No Fiebre)
        probabilidad = (P_NoFiebre_dado_Gripe * P_Gripe) / P_NoFiebre
        
        return probabilidad

# --- Interfaz de Usuario ---
print("=== Sistema Simple de Diagnóstico ===")
print("El programa calcula P(gripe | Fiebre)\n")

print("Usando:")
print(f"P(gripe) = {P_Gripe}")
print(f"P(Fiebre|gripe) = {P_Fiebre_dado_Gripe}")
print(f"P(Fiebre|no gripe) = {P_Fiebre_dado_NoGripe}\n")

# El usuario ingresa si hay Fiebre (si/no)
entrada = input("¿El paciente tiene fiebre? (si/no): ").strip().lower()

if entrada in ['si', 'sí', 's', 'yes', 'y']:
    tiene_fiebre = True
    evidencia = "Fiebre"
elif entrada in ['no', 'n']:
    tiene_fiebre = False
    evidencia = "No Fiebre"
else:
    print("Entrada inválida. Por favor ingrese 'si' o 'no'.")
    exit()

# Calcular la probabilidad actualizada
probabilidad_actualizada = calcular_P_gripe_dado_fiebre(tiene_fiebre)

# El programa devuelve la probabilidad actualizada
print("\n======================================")
print(f"Probabilidad actualizada: P(gripe | {evidencia}) = {probabilidad_actualizada:.4f}")
print(f"Equivale a: {probabilidad_actualizada * 100:.2f}%")
print("======================================")

