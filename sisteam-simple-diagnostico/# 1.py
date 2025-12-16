# --- Datos del problema ---
P_Gripe = 0.2       
P_Fiebre_dado_Gripe = 0.85 
P_Fiebre_dado_NoGripe = 0.1
P_NoGripe = 1 - P_Gripe # P(No Gripe) = 0.80

def calcular_diagnostico_bayesian(tiene_fiebre):
    """
    Calcula la probabilidad de tener Gripe (P(Gripe|Evidencia)) 
    basándose en si el usuario tiene fiebre o no.
    """
    print("\n--- Analizando la Evidencia ---")
    
    if tiene_fiebre:
        # --- CASO 1: El usuario tiene fiebre (Evidencia = Fiebre) ---
        
        # 1. Calcular P(Fiebre) (Probabilidad Total)
        P_Fiebre = (P_Fiebre_dado_Gripe * P_Gripe) + (P_Fiebre_dado_NoGripe * P_NoGripe)
        
        # 2. Aplicar Bayes: P(Gripe | Fiebre)
        prob_numerador = P_Fiebre_dado_Gripe * P_Gripe
        prob_final = prob_numerador / P_Fiebre
        
        print(f"Evidencia ingresada: SÍ hay Fiebre.")
        print(f"P(Fiebre) (Prob. Total) = {P_Fiebre:.2f}")
        return prob_final
    
    else:
        # --- CASO 2: El usuario NO tiene fiebre (Evidencia = No Fiebre) ---
        
        # 1. Calcular P(No Fiebre | Gripe) y P(No Fiebre | No Gripe)
        # P(No Fiebre | Gripe) = 1 - P(Fiebre | Gripe)
        P_NoFiebre_dado_Gripe = 1 - P_Fiebre_dado_Gripe  # 1 - 0.85 = 0.15
        
        # P(No Fiebre | No Gripe) = 1 - P(Fiebre | No Gripe)
        P_NoFiebre_dado_NoGripe = 1 - P_Fiebre_dado_NoGripe  # 1 - 0.10 = 0.90
        
        # 2. Calcular P(No Fiebre) (Probabilidad Total)
        P_NoFiebre = (P_NoFiebre_dado_Gripe * P_Gripe) + (P_NoFiebre_dado_NoGripe * P_NoGripe)
        
        # 3. Aplicar Bayes: P(Gripe | No Fiebre)
        # P(Gripe|No Fiebre) = (P(No Fiebre|Gripe) * P(Gripe)) / P(No Fiebre)
        prob_numerador = P_NoFiebre_dado_Gripe * P_Gripe
        prob_final = prob_numerador / P_NoFiebre
        
        print(f"Evidencia ingresada: NO hay Fiebre.")
        print(f"P(No Fiebre) (Prob. Total) = {P_NoFiebre:.2f}")
        return prob_final

# --- Interfaz de Usuario ---

print("=== Sistema Simple de Diagnóstico ===")
print(f"Probabilidad Inicial de Gripe P(Gripe): {P_Gripe * 100:.0f}%")

entrada = input("¿El paciente tiene fiebre? (Sí/No): ").strip().lower()

if entrada in ['s', 'si', 'sí', 's']:
    tiene_fiebre = True
elif entrada in ['n', 'no']:
    tiene_fiebre = False
else:
    print("Entrada inválida. Terminando programa.")
    exit()

# Calcular y mostrar resultado
probabilidad_actualizada = calcular_diagnostico_bayesian(tiene_fiebre)

print("\n======================================")
print(f"Probabilidad de Gripe actualizada: {probabilidad_actualizada:.4f}")
print(f"Equivale a un {probabilidad_actualizada * 100:.2f}%")
print("======================================")