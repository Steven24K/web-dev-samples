import React, { useState } from 'react';

const RandomStudentGroup: React.FC = () => {
    // Initial state for all groups
    const [groups] = useState([
        'CSS',
        'Team 4',
        'Team Rysk',
        'Pixel Planners',
        'Team Sten',
        '404 Founders',
        'Take 2'
    ]);

    // State for selected group and history
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [selectionHistory, setSelectionHistory] = useState<string[]>([]);

    const selectRandomGroup = () => {
        // Filter out groups that have already been selected
        const availableGroups = groups.filter(group => !selectionHistory.includes(group));

        if (availableGroups.length === 0) {
            // If all groups have been selected, reset history
            setSelectionHistory([]);
            const randomIndex = Math.floor(Math.random() * groups.length);
            setSelectedGroup(groups[randomIndex]);
            setSelectionHistory([groups[randomIndex]]);
        } else {
            // Select a random group from available groups
            const randomIndex = Math.floor(Math.random() * availableGroups.length);
            setSelectedGroup(availableGroups[randomIndex]);
            setSelectionHistory([...selectionHistory, availableGroups[randomIndex]]);
        }
    };

    return (
        <div className="random-group-container">
            <h2>Random Student Group Selector</h2>
            
            <button onClick={selectRandomGroup} disabled={groups.length === selectionHistory.length}>
                Select Random Group
            </button>

            {selectedGroup && (
                <div className="selected-group">
                    <h3>Selected Group:</h3>
                    <p>{selectedGroup}</p>
                </div>
            )}

            <div className="history">
                <h3>Selection History:</h3>
                <ul>
                    {selectionHistory.map((group, index) => (
                        <li key={index}>{group}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RandomStudentGroup;