// Copy and paste this entire script into your browser console
// while you have the Claude interface open with your uploaded CSV files

async function generateGraphEdgesCSV() {
    console.log('Starting graph edge generation...');
    
    try {
        // Read all CSV files
        const eventSMEContent = await window.fs.readFile('eventsubjectmatterexperts.csv', { encoding: 'utf8' });
        const eventTopicSMEContent = await window.fs.readFile('eventtopicsubjectmatterexperts.csv', { encoding: 'utf8' });
        const orgMembersContent = await window.fs.readFile('organizationmembers.csv', { encoding: 'utf8' });
        const topicSMEContent = await window.fs.readFile('topicsubjectmatterexperts.csv', { encoding: 'utf8' });
        const topicTestimoniesContent = await window.fs.readFile('topicstestimonies.csv', { encoding: 'utf8' });
        
        // Parse CSV files
        function parseCSV(content) {
            const lines = content.trim().split('\n');
            const headers = lines[0].split(',');
            return lines.slice(1).map(line => {
                const values = line.split(',');
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header.trim()] = values[i] ? values[i].trim() : '';
                });
                return obj;
            });
        }
        
        const eventSME = parseCSV(eventSMEContent);
        const eventTopicSME = parseCSV(eventTopicSMEContent);
        const orgMembers = parseCSV(orgMembersContent);
        const topicSME = parseCSV(topicSMEContent);
        const topicTestimonies = parseCSV(topicTestimoniesContent);
        
        // Create all edges
        const edges = [];
        
        // Event -> Expert (Red)
        eventSME.forEach(row => {
            edges.push(`${row.event},${row['subject-matter-expert']},event_to_expert,#FF6B6B`);
        });
        
        // Organization -> Member (Teal)
        orgMembers.forEach(row => {
            edges.push(`${row.organization},${row.member},organization_to_member,#4ECDC4`);
        });
        
        // Expert -> Topic (Blue)
        topicSME.forEach(row => {
            edges.push(`${row['subject-matter-expert']},${row.topic},expert_to_topic,#45B7D1`);
        });
        
        // Testimony -> Topic (Green)
        topicTestimonies.forEach(row => {
            edges.push(`${row.testimony},${row.topic},testimony_to_topic,#96CEB4`);
        });
        
        // Event -> Topic (Yellow)
        eventTopicSME.forEach(row => {
            edges.push(`${row.event},${row.topic},event_to_topic,#FECA57`);
        });
        
        // Create CSV content
        const csvContent = 'source,target,edge_type,color\n' + edges.join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'graph_edges.csv');
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Success! Downloaded graph_edges.csv with ${edges.length} edges`);
        
        // Show statistics
        const stats = {
            'event_to_expert': eventSME.length,
            'organization_to_member': orgMembers.length,
            'expert_to_topic': topicSME.length,
            'testimony_to_topic': topicTestimonies.length,
            'event_to_topic': eventTopicSME.length
        };
        
        console.log('\nEdge type distribution:');
        Object.entries(stats).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });
        console.log(`  Total: ${edges.length}`);
        
    } catch (error) {
        console.error('Error:', error);
        console.log('Make sure you have all 5 CSV files uploaded in the Claude interface');
    }
}

// Run the function
generateGraphEdgesCSV();
