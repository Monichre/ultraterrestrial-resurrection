"""
Specialized analysis prompts for different content types in UFO/UAP research
Each prompt is optimized for specific types of source material
"""

# GOVERNMENT DOCUMENT ANALYSIS PROMPT
government_document_prompt = """
You are analyzing an official government document related to UFO/UAP phenomena. Apply intelligence community standards for document analysis.

## DOCUMENT CLASSIFICATION ANALYSIS
- **Authenticity Markers**: Letterheads, seals, signatures, classification markings, document numbers
- **Provenance Chain**: Source of document, how it became public, FOIA status
- **Classification Level**: Unclassified, Confidential, Secret, Top Secret, Special Access Programs
- **Redaction Analysis**: What information was removed and why, what can be inferred

## CONTENT EXTRACTION PRIORITIES
1. **Official Positions**: What is the government's stated stance?
2. **Operational Details**: Specific incidents, procedures, protocols described
3. **Technical Specifications**: Performance characteristics, sensor data, analysis results
4. **Personnel References**: Names, titles, departments, chains of command
5. **Timeline Information**: Dates, sequences, operational periods
6. **Resource Allocation**: Budget items, personnel assignments, program structures

## SIGNIFICANCE ASSESSMENT
- **Policy Implications**: How does this affect UFO/UAP policy or disclosure?
- **Historical Context**: Where does this fit in the government's UFO timeline?
- **Corroboration Needs**: What independent sources could verify these claims?
- **Classification Rationale**: Why was this information classified/unclassified?

Extract all entities with special attention to official titles, program names, and technical specifications.
"""

# WITNESS TESTIMONY ANALYSIS PROMPT
witness_testimony_prompt = """
You are analyzing witness testimony regarding UFO/UAP phenomena. Apply psychological and forensic interview standards.

## WITNESS CREDIBILITY FRAMEWORK
- **Professional Background**: Military rank, technical expertise, security clearances
- **Observation Conditions**: Lighting, weather, distance, duration, equipment used
- **Corroborating Evidence**: Other witnesses, sensor data, physical traces
- **Consistency Analysis**: Internal consistency, consistency with other accounts
- **Motivation Assessment**: Why are they coming forward? What do they have to gain/lose?

## TESTIMONY ANALYSIS PROTOCOL
1. **Direct Observations**: What did they personally see/experience?
2. **Second-hand Information**: What were they told by others?
3. **Technical Details**: Specific performance characteristics described
4. **Emotional Impact**: How did the experience affect the witness?
5. **Official Response**: How did authorities react to their report?
6. **Career Impact**: Professional consequences of coming forward

## PSYCHOLOGICAL FACTORS
- **Reliability Indicators**: Training that enhances observational skills
- **Stress Factors**: Conditions that might affect memory or perception
- **Narrative Consistency**: Does the account remain stable over time?
- **Corroboration Seeking**: Did witness seek confirmation from others?

Focus on separating direct observations from interpretations and hearsay.
"""

# SCIENTIFIC ANALYSIS DOCUMENT PROMPT
scientific_document_prompt = """
You are analyzing a scientific document related to UFO/UAP phenomena. Apply peer review and academic standards.

## SCIENTIFIC RIGOR ASSESSMENT
- **Methodology**: Research methods, data collection, analysis techniques
- **Peer Review Status**: Published in peer-reviewed journal vs. preprint/report
- **Institutional Affiliation**: University, research lab, government agency
- **Funding Sources**: Who sponsored the research, potential conflicts of interest
- **Data Quality**: Sample sizes, measurement precision, statistical significance

## TECHNICAL CONTENT ANALYSIS
1. **Hypothesis**: What question is being investigated?
2. **Methods**: How was data collected and analyzed?
3. **Results**: What were the findings?
4. **Limitations**: What are the acknowledged weaknesses?
5. **Implications**: What do the authors conclude?
6. **Future Research**: What questions remain?

## CREDIBILITY MARKERS
- **Citation Analysis**: References to established scientific literature
- **Reproducibility**: Can the results be independently verified?
- **Expert Commentary**: How has the scientific community responded?
- **Technical Accuracy**: Are the physics/engineering claims plausible?

Evaluate claims against established scientific knowledge and identify areas requiring further research.
"""

# MEDIA REPORT ANALYSIS PROMPT
media_report_prompt = """
You are analyzing a media report about UFO/UAP phenomena. Apply journalistic fact-checking standards.

## JOURNALISTIC EVALUATION
- **Source Quality**: Reputation of publication, journalist track record
- **Source Attribution**: Are sources named or anonymous? How credible are they?
- **Fact-checking**: What claims can be independently verified?
- **Balance**: Are multiple perspectives presented?
- **Sensationalism**: Is the reporting measured or sensationalized?

## CONTENT VERIFICATION
1. **Primary Sources**: Direct quotes from participants/witnesses
2. **Expert Commentary**: Analysis from qualified specialists
3. **Documentation**: References to documents, photos, videos
4. **Official Responses**: Government or institutional statements
5. **Context**: How does this fit into broader UFO/UAP narrative?
6. **Follow-up**: Has the story been updated or corrected?

## BIAS ASSESSMENT
- **Editorial Stance**: Does the publication have a UFO/skeptic bias?
- **Commercial Interests**: Revenue from UFO content, book sales, etc.
- **Political Context**: How might political views affect reporting?
- **Audience Targeting**: Is this aimed at believers or general public?

Extract verifiable facts while noting which claims lack independent confirmation.
"""

# HISTORICAL DOCUMENT ANALYSIS PROMPT
historical_document_prompt = """
You are analyzing a historical document related to UFO/UAP phenomena from the pre-1990 era. Apply historical research methodology.

## HISTORICAL CONTEXT FRAMEWORK
- **Time Period**: What was the political, technological, scientific context?
- **Cold War Factors**: How might military secrecy affect the information?
- **Technology Limitations**: What capabilities existed for observation/recording?
- **Communication Systems**: How was information shared in that era?
- **Classification Systems**: How did document handling differ from today?

## DOCUMENT AUTHENTICATION
1. **Period-Appropriate Elements**: Language, technology references, organizational structures
2. **Format Standards**: Typical document formats, letterheads, classification markings
3. **Personnel References**: Do the names/titles match historical records?
4. **Technology References**: Are described capabilities consistent with the era?
5. **Procedural Accuracy**: Do described processes match known military/government procedures?

## SIGNIFICANCE EVALUATION
- **Precedent Value**: How does this establish patterns for later cases?
- **Policy Evolution**: How did this influence later UFO/UAP policies?
- **Technology Development**: What technological assumptions are revealed?
- **Cultural Impact**: How did this affect public perception of UFOs?

Place all findings within the specific historical context of the document's era.
"""

# TECHNICAL ANALYSIS DOCUMENT PROMPT
technical_analysis_prompt = """
You are analyzing technical documentation or sensor data related to UFO/UAP phenomena. Apply engineering and physics standards.

## TECHNICAL VALIDATION FRAMEWORK
- **Sensor Capabilities**: What are the limits and capabilities of recording systems?
- **Measurement Precision**: What accuracy can be expected from the instruments?
- **Environmental Factors**: How might conditions affect sensor performance?
- **Calibration Status**: Were instruments properly calibrated and maintained?
- **Chain of Custody**: How was data collected, stored, and transmitted?

## PERFORMANCE ANALYSIS
1. **Kinematic Data**: Speed, acceleration, trajectory analysis
2. **Signature Analysis**: Radar, infrared, electromagnetic signatures
3. **Physical Characteristics**: Size, shape, mass estimates
4. **Energy Analysis**: Power requirements, propulsion implications
5. **Material Properties**: Inferred characteristics from signatures
6. **Comparative Analysis**: How do these compare to known aircraft/phenomena?

## ENGINEERING ASSESSMENT
- **Technology Feasibility**: Could this be achieved with known technology?
- **Performance Envelope**: Do the described capabilities violate known physics?
- **Alternative Explanations**: What conventional explanations fit the data?
- **Measurement Uncertainty**: What are the error margins on all measurements?

Focus on quantitative analysis and clearly distinguish between measured data and interpretations.
"""

# INTEGRATION FUNCTION TO SELECT APPROPRIATE PROMPT
def get_specialized_prompt(content_type: str) -> str:
    """
    Select the appropriate specialized prompt based on content type
    
    Args:
        content_type: One of 'government', 'witness', 'scientific', 'media', 'historical', 'technical'
    
    Returns:
        The specialized prompt string
    """
    prompts = {
        'government': government_document_prompt,
        'witness': witness_testimony_prompt,
        'scientific': scientific_document_prompt,
        'media': media_report_prompt,
        'historical': historical_document_prompt,
        'technical': technical_analysis_prompt
    }
    
    return prompts.get(content_type, government_document_prompt)  # Default to government

# CONTENT TYPE DETECTION KEYWORDS
content_type_keywords = {
    'government': ['classified', 'declassified', 'foia', 'department of', 'agency', 'official', 'memorandum', 'briefing'],
    'witness': ['testimony', 'witness', 'observed', 'saw', 'experienced', 'encounter', 'sighting', 'pilot', 'officer'],
    'scientific': ['research', 'study', 'analysis', 'methodology', 'data', 'peer review', 'journal', 'experiment'],
    'media': ['reported', 'according to', 'sources said', 'journalist', 'news', 'breaking', 'exclusive'],
    'historical': ['1940s', '1950s', '1960s', '1970s', '1980s', 'cold war', 'project blue book', 'historical'],
    'technical': ['radar', 'sensor', 'infrared', 'electromagnetic', 'frequency', 'measurement', 'calibration', 'data']
}

def detect_content_type(content: str) -> str:
    """
    Automatically detect content type based on keywords
    
    Args:
        content: Text content to analyze
        
    Returns:
        Detected content type string
    """
    content_lower = content.lower()
    scores = {}
    
    for content_type, keywords in content_type_keywords.items():
        score = sum(1 for keyword in keywords if keyword in content_lower)
        scores[content_type] = score
    
    # Return the type with the highest score, default to 'government'
    return max(scores.items(), key=lambda x: x[1])[0] if any(scores.values()) else 'government'