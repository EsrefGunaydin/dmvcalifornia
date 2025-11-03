#!/usr/bin/env python3
"""
Fix truncated blog posts by replacing with full content from live site
"""

import json
import random

# Random author names we're using
AUTHORS = [
    "Sarah Mitchell",
    "David Chen",
    "Jennifer Rodriguez",
    "Michael Anderson",
    "Lisa Thompson",
    "Robert Johnson"
]

# Full content for truncated posts (fetched from live site)
fixed_posts = {
    'new-traffic-laws-for-california-drivers-in-2025': {
        'content': '''<h2>Speed Limits and Automated Enforcement</h2>
<p>California maintains its existing statewide speed limits but has introduced automated speed camera enforcement in select cities. "Speed safety camera systems will be tested in Los Angeles, San Francisco, San Jose, Oakland, and Glendale" with a 30-day warning period before citations are issued. These radar/laser systems photograph license plates of speeding vehicles and mail tickets to registered owners.</p>

<h2>Hands-Free Driving (Distracted Driving) Laws</h2>
<p>California strengthened penalties for handheld phone use while driving. The state increased fines for texting or holding a phone, and repeat offenders within 36 months face mandatory driver education courses and points on their driving record. "California Vehicle Code §23123 prohibits drivers from holding a phone" while driving.</p>

<h2>DUI Regulations and Impaired Driving</h2>
<p>DUI penalties became significantly more severe:</p>
<ul>
<li><strong>Repeat offenses:</strong> A third DUI within 10 years now carries a minimum 180-day jail sentence; a fourth DUI can result in permanent license revocation</li>
<li><strong>Ignition interlock devices:</strong> First-time offenders with BAC of 0.15% or higher must install breathalyzer devices for at least 6 months</li>
<li><strong>Child endangerment:</strong> First DUI with a minor passenger requires mandatory 48-hour jail time</li>
<li><strong>Drug-impaired driving:</strong> New roadside saliva tests detect marijuana and other substances; mixed alcohol/drug violations face enhanced penalties</li>
</ul>

<h2>Red Light and Stop Sign Rules</h2>
<p><strong>"Daylighting" law (AB 413):</strong> Parking within 20 feet of marked or unmarked crosswalks is now illegal to improve pedestrian visibility at intersections.</p>
<p>California law requires drivers to make complete stops when pedestrians occupy crosswalks. This clarification emphasizes that drivers cannot proceed until pedestrians have safely crossed.</p>

<h2>Lane Usage and Road Safety Updates</h2>
<ul>
<li><strong>HOV lane access:</strong> Electric and low-emission vehicles with valid decals may use carpool lanes through January 1, 2027 under AB 2678</li>
<li><strong>Bus merging:</strong> Transit buses can now activate rear-mounted yield signs when merging; "drivers in adjacent lanes should yield and let the bus re-enter"</li>
<li><strong>Street racing crackdown:</strong> Law enforcement may impound vehicles used in illegal street racing or sideshows for up to 30 days</li>
</ul>

<h2>Other Notable Changes</h2>
<ul>
<li><strong>Minimum insurance coverage:</strong> California raised mandatory liability limits to $30,000 per person, $60,000 per accident, and $15,000 property damage (SB 1107)</li>
<li><strong>License plate obstruction:</strong> Assembly Bill 2111 prohibits altering reflective coatings or using covers that obstruct plate readability</li>
<li><strong>Registration grace period:</strong> Assembly Bill 256 provides a 60-day grace period for expired vehicle registration tags without penalty</li>
</ul>''',
        'excerpt': 'Learn about the new California traffic laws for 2025 including speed camera enforcement, stricter DUI penalties, hands-free driving rules, daylighting requirements, and updated insurance requirements.'
    },
    'top-12-factors-that-affect-nighttime-driving': {
        'content': '''<h2>1. Reduced Visibility</h2>
<p>Darkness significantly limits how far ahead you can see. This reduced sight distance means less time to react to hazards, obstacles, or changes in road conditions.</p>

<h2>2. Glare from Headlights</h2>
<p>Oncoming headlights, especially high beams, can temporarily blind drivers. This glare effect reduces your ability to see the road and requires time for your eyes to readjust.</p>

<h2>3. Depth Perception Issues</h2>
<p>Night driving makes it harder to judge distances and speeds of other vehicles. This can affect your ability to merge, change lanes, or maintain safe following distances.</p>

<h2>4. Fatigue and Drowsiness</h2>
<p>Driving at night often coincides with your body's natural sleep cycle. Fatigue significantly impairs reaction time, decision-making, and overall alertness behind the wheel.</p>

<h2>5. Impaired Drivers</h2>
<p>Statistics show a higher percentage of impaired drivers on the road at night, particularly on weekends. DUI-related accidents are more common during nighttime hours.</p>

<h2>6. Wildlife Activity</h2>
<p>Many animals are most active at dawn and dusk. Deer, in particular, pose a significant risk to nighttime drivers, especially in rural areas.</p>

<h2>7. Limited Peripheral Vision</h2>
<p>Your peripheral vision relies heavily on light. At night, you lose much of this side awareness, making it harder to detect vehicles or pedestrians approaching from the side.</p>

<h2>8. Rush Hour Traffic</h2>
<p>During winter months, evening rush hour occurs after dark. This combines the challenges of heavy traffic with reduced visibility.</p>

<h2>9. Weather Conditions</h2>
<p>Rain, fog, and snow are harder to navigate at night. Wet roads reflect headlights and streetlights, creating confusing visual patterns and reducing visibility further.</p>

<h2>10. Construction Zones</h2>
<p>Nighttime construction zones can be particularly hazardous. Warning signs and barriers may be less visible, and lane changes can be more challenging to navigate in the dark.</p>

<h2>11. Eye Health Factors</h2>
<p>Age-related vision changes, astigmatism, and other eye conditions can make night driving more difficult. Many people experience worsening night vision as they age.</p>

<h2>12. Vehicle Lighting Issues</h2>
<p>Dim or misaligned headlights, dirty windshields, or worn wiper blades compound visibility problems at night. Regular maintenance of your vehicle's lighting and glass surfaces is crucial for safe nighttime driving.</p>

<h2>Safety Tips for Night Driving</h2>
<ul>
<li>Keep your windshield clean inside and out</li>
<li>Ensure headlights are properly aimed and bright</li>
<li>Reduce speed to account for limited visibility</li>
<li>Increase following distance to allow more reaction time</li>
<li>Avoid looking directly at oncoming headlights</li>
<li>Take regular breaks on long nighttime drives</li>
<li>Get regular eye exams and wear corrective lenses if prescribed</li>
</ul>''',
        'excerpt': 'Discover the top 12 factors that make nighttime driving more dangerous including reduced visibility, glare, fatigue, impaired drivers, wildlife, and weather conditions. Learn essential safety tips.'
    },
    '10-most-important-roadway-signs-with-meaning': {
        'content': '''<h2>1. Stop Sign</h2>
<p>The iconic red octagon with white letters requires drivers to come to a complete stop at the marked line, crosswalk, or before entering the intersection. You must yield to all vehicles and pedestrians before proceeding.</p>

<h2>2. Yield Sign</h2>
<p>This downward-pointing red and white triangle instructs drivers to slow down and prepare to stop if necessary. You must allow other vehicles and pedestrians with the right-of-way to proceed first.</p>

<h2>3. Speed Limit Sign</h2>
<p>These rectangular white signs with black lettering indicate the maximum legal speed for ideal road conditions. Remember that you may need to drive slower in adverse weather or heavy traffic.</p>

<h2>4. Do Not Enter Sign</h2>
<p>A white rectangular sign with red background and white letters warns you are about to enter a restricted area, typically indicating one-way traffic coming toward you. This sign prevents wrong-way driving.</p>

<h2>5. Wrong Way Sign</h2>
<p>Similar to Do Not Enter, this red sign with white letters appears when you've entered a roadway in the wrong direction. If you see this sign, immediately pull over safely and turn around.</p>

<h2>6. One Way Sign</h2>
<p>Black and white rectangular signs indicate that traffic flows in only one direction. These commonly appear on city streets and highway ramps. Always check for these signs before turning.</p>

<h2>7. No Parking/No Stopping Signs</h2>
<p>Red and white signs indicate areas where parking or stopping is prohibited. Violating these restrictions can result in fines or your vehicle being towed.</p>

<h2>8. Pedestrian Crossing Sign</h2>
<p>Yellow diamond-shaped signs with a walking figure warn of pedestrian crossings ahead. Slow down and be prepared to stop for people crossing the street.</p>

<h2>9. Railroad Crossing Sign</h2>
<p>The distinctive yellow circular sign with a large "X" and two "R"s warns of an upcoming railroad crossing. Slow down, look and listen for trains, and never stop on the tracks.</p>

<h2>10. Merge and Lane Ending Signs</h2>
<p>Yellow diamond signs show when lanes are merging or ending. These give you advance warning to safely merge into continuing traffic lanes.</p>

<h2>Additional Important Signs</h2>
<ul>
<li><strong>School Zone Signs:</strong> Indicate reduced speed limits during school hours</li>
<li><strong>Construction Zone Signs:</strong> Orange signs warning of roadwork ahead</li>
<li><strong>Curve Warning Signs:</strong> Yellow signs indicating sharp turns</li>
<li><strong>Slippery When Wet:</strong> Warns of potentially hazardous road surface conditions</li>
</ul>

<h2>Sign Colors and Shapes</h2>
<p>Understanding sign colors helps you quickly identify their purpose:</p>
<ul>
<li><strong>Red:</strong> Stop, yield, or prohibition</li>
<li><strong>Yellow:</strong> Warning of hazards ahead</li>
<li><strong>Orange:</strong> Construction and maintenance warnings</li>
<li><strong>Green:</strong> Directional guidance and distance information</li>
<li><strong>Blue:</strong> Motorist services (rest areas, gas, lodging)</li>
<li><strong>Brown:</strong> Recreation and cultural points of interest</li>
</ul>''',
        'excerpt': 'Master the 10 most important road signs every driver must know, including stop signs, yield signs, speed limits, do not enter, and pedestrian crossings. Learn sign colors and shapes.'
    },
    'muestra-del-examen-escrito-para-licencia-de-manejar': {
        'content': '''<h2>Información General sobre el Examen</h2>
<p>El examen escrito del DMV de California es un paso crucial para obtener su licencia de conducir. Esta prueba evalúa su conocimiento de las leyes de tránsito, señales de tráfico, y prácticas de conducción segura.</p>

<h2>Formato del Examen</h2>
<p>El examen consiste en 46 preguntas de opción múltiple. Debe responder correctamente al menos 38 preguntas (83%) para aprobar. Tiene tres intentos para aprobar el examen.</p>

<h2>Temas Principales Cubiertos</h2>

<h3>1. Señales de Tráfico</h3>
<p>Debe reconocer y comprender el significado de:</p>
<ul>
<li>Señales de alto (STOP)</li>
<li>Señales de ceda el paso (YIELD)</li>
<li>Señales de límite de velocidad</li>
<li>Señales de advertencia (amarillas)</li>
<li>Señales de construcción (naranjas)</li>
<li>Señales de tránsito de una sola vía</li>
</ul>

<h3>2. Reglas de Derecho de Paso</h3>
<ul>
<li>Quién tiene prioridad en intersecciones</li>
<li>Reglas para peatones en cruces</li>
<li>Ceder el paso a vehículos de emergencia</li>
<li>Rotondas y glorietas</li>
</ul>

<h3>3. Límites de Velocidad</h3>
<ul>
<li>Zonas residenciales: 25 mph</li>
<li>Zonas escolares: 15-25 mph cuando hay niños presentes</li>
<li>Callejones: 15 mph</li>
<li>Carreteras: variable según señalización</li>
</ul>

<h3>4. Conducción Segura</h3>
<ul>
<li>Distancia de seguimiento apropiada</li>
<li>Cambio de carril seguro</li>
<li>Uso de luces direccionales</li>
<li>Manejo en condiciones climáticas adversas</li>
<li>Compartir el camino con bicicletas y motocicletas</li>
</ul>

<h3>5. Estacionamiento</h3>
<ul>
<li>Reglas de estacionamiento en colinas</li>
<li>Zonas donde está prohibido estacionar</li>
<li>Distancia requerida de hidrantes</li>
<li>Estacionamiento para personas con discapacidades</li>
</ul>

<h2>Ejemplos de Preguntas</h2>

<p><strong>Pregunta 1:</strong> ¿Cuál es el límite de velocidad en un callejón?</p>
<ul>
<li>A) 25 mph</li>
<li>B) 15 mph ✓</li>
<li>C) 10 mph</li>
<li>D) 20 mph</li>
</ul>

<p><strong>Pregunta 2:</strong> ¿A qué distancia debe estacionar de un hidrante?</p>
<ul>
<li>A) 5 pies</li>
<li>B) 10 pies</li>
<li>C) 15 pies ✓</li>
<li>D) 20 pies</li>
</ul>

<p><strong>Pregunta 3:</strong> Si dos vehículos llegan a una intersección al mismo tiempo, ¿quién tiene el derecho de paso?</p>
<ul>
<li>A) El vehículo que llegó primero</li>
<li>B) El vehículo a la derecha ✓</li>
<li>C) El vehículo a la izquierda</li>
<li>D) El vehículo más grande</li>
</ul>

<h2>Cómo Prepararse</h2>
<ul>
<li>Estudie el Manual del Conductor de California (disponible en español)</li>
<li>Tome exámenes de práctica en línea</li>
<li>Revise las señales de tráfico comunes</li>
<li>Practique con aplicaciones del DMV</li>
<li>Descanse bien la noche anterior al examen</li>
</ul>

<h2>Consejos para el Día del Examen</h2>
<ul>
<li>Llegue temprano al DMV</li>
<li>Traiga documentos de identificación válidos</li>
<li>Lea cada pregunta cuidadosamente</li>
<li>No se apresure - tome su tiempo</li>
<li>Si no está seguro, use el proceso de eliminación</li>
</ul>

<h2>Recursos Adicionales</h2>
<p>Visite el sitio web oficial del DMV de California para:</p>
<ul>
<li>Descargar el manual del conductor en español</li>
<li>Programar su cita para el examen</li>
<li>Tomar exámenes de práctica oficiales</li>
<li>Ver videos educativos sobre conducción segura</li>
</ul>''',
        'excerpt': 'Guía completa para el examen escrito del DMV en español. Aprenda sobre el formato, temas principales, ejemplos de preguntas, y consejos para aprobar su examen de licencia de conducir en California.'
    }
}

print("=== Fixing Truncated Blog Posts ===\n")

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

fixed_count = 0

for post in blog_data['posts']:
    if post['slug'] in fixed_posts:
        old_length = len(post['content'])
        post['content'] = fixed_posts[post['slug']]['content']
        post['excerpt'] = fixed_posts[post['slug']]['excerpt']
        new_length = len(post['content'])

        print(f"✓ Fixed: {post['title']}")
        print(f"  Slug: /{post['slug']}")
        print(f"  Content: {old_length} → {new_length} characters (+{new_length - old_length})")
        print(f"  Author: {post['author']}")
        print()

        fixed_count += 1

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f"✅ Fixed {fixed_count} truncated posts")
print("💾 Saved updated blog_posts.json")
print("\nYou can now access the complete articles:")
for slug in fixed_posts.keys():
    print(f"  • http://localhost:3001/{slug}/")
