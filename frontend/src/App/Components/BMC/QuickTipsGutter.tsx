import React, { useState, useEffect, RefObject } from 'react';
import { QuickTip } from '../../api/chatbotService';
import './quick-tips-gutter.css';

interface QuickTipsGutterProps {
    tips: QuickTip[];
    loading?: boolean;
    textareaRef: RefObject<HTMLTextAreaElement>;
}

interface GroupedTip {
    line: number;
    tips: QuickTip[];
    position: number; // pixels from top
}

const QuickTipsGutter: React.FC<QuickTipsGutterProps> = ({ tips, loading, textareaRef }) => {
    const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
    const [groupedTips, setGroupedTips] = useState<GroupedTip[]>([]);

    useEffect(() => {
        if (!tips || tips.length === 0 || !textareaRef.current) {
            setGroupedTips([]);
            return;
        }

        const textarea = textareaRef.current;
        const lineHeight = parseFloat(window.getComputedStyle(textarea).lineHeight);
        const paddingTop = parseFloat(window.getComputedStyle(textarea).paddingTop);

        // Group tips by line number
        const tipsByLine = new Map<number, QuickTip[]>();
        tips.forEach(tip => {
            const line = tip.line;
            if (!tipsByLine.has(line)) {
                tipsByLine.set(line, []);
            }
            tipsByLine.get(line)!.push(tip);
        });

        // Calculate positions for each group
        const grouped: GroupedTip[] = [];
        tipsByLine.forEach((lineTips, lineNumber) => {
            let position: number;
            if (lineNumber === 0) {
                // Unmatched tips go at the bottom
                position = -1; // Special value for bottom positioning
            } else {
                // Position at the specific line (line numbers are 1-based)
                position = paddingTop + (lineNumber - 1) * lineHeight + lineHeight / 2;
            }
            grouped.push({
                line: lineNumber,
                tips: lineTips,
                position
            });
        });

        // Sort by position (bottom items last)
        grouped.sort((a, b) => {
            if (a.position === -1) return 1;
            if (b.position === -1) return -1;
            return a.position - b.position;
        });

        setGroupedTips(grouped);
    }, [tips, textareaRef]);

    const getIcon = (tip: QuickTip): { icon: string; color: string } => {
        const text = tip.tip;
        if (text.includes('⚠️') || text.toLowerCase().includes('missing')) {
            return { icon: '⚠️', color: '#f39c12' }; // Orange warning
        } else if (text.toLowerCase().startsWith('add') || text.toLowerCase().startsWith('name')) {
            return { icon: '💡', color: '#3498db' }; // Blue suggestion
        } else if (text.toLowerCase().startsWith('consider') || text.includes('?')) {
            return { icon: '🎯', color: '#9b59b6' }; // Purple context
        } else {
            return { icon: '💡', color: '#3498db' }; // Default suggestion
        }
    };

    if (loading) {
        return (
            <div className="quick-tips-gutter">
                <div className="gutter-loading">
                    <div className="loading-dot"></div>
                </div>
            </div>
        );
    }

    if (!tips || tips.length === 0 || groupedTips.length === 0) {
        return <div className="quick-tips-gutter" />;
    }

    return (
        <div className="quick-tips-gutter">
            {groupedTips.map((group, groupIndex) => {
                const { icon, color } = getIcon(group.tips[0]);
                const isBottom = group.position === -1;
                const style: React.CSSProperties = isBottom 
                    ? { marginTop: 'auto' } 
                    : { position: 'absolute', top: `${group.position}px`, transform: 'translateY(-50%)' };

                return (
                    <div
                        key={groupIndex}
                        className={`gutter-icon ${isBottom ? 'gutter-icon-bottom' : ''}`}
                        style={{ ...style, color }}
                        onMouseEnter={() => setHoveredLineIndex(groupIndex)}
                        onMouseLeave={() => setHoveredLineIndex(null)}
                    >
                        <span className="icon">{icon}</span>
                        {group.tips.length > 1 && (
                            <span className="tip-count-badge">{group.tips.length}</span>
                        )}
                        {hoveredLineIndex === groupIndex && (
                            <div className="gutter-tooltip">
                                {group.tips.map((tip, tipIndex) => (
                                    <div key={tipIndex} className="tooltip-tip">
                                        {tip.tip}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default QuickTipsGutter;

