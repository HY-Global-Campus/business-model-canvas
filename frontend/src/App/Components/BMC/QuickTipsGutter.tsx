import React, { useState } from 'react';
import './quick-tips-gutter.css';

interface QuickTipsGutterProps {
    tips: string[];
    loading?: boolean;
}

const QuickTipsGutter: React.FC<QuickTipsGutterProps> = ({ tips, loading }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getIcon = (tip: string): { icon: string; color: string } => {
        if (tip.includes('⚠️') || tip.toLowerCase().includes('missing')) {
            return { icon: '⚠️', color: '#f39c12' }; // Orange warning
        } else if (tip.toLowerCase().startsWith('add') || tip.toLowerCase().startsWith('name')) {
            return { icon: '💡', color: '#3498db' }; // Blue suggestion
        } else if (tip.toLowerCase().startsWith('consider') || tip.includes('?')) {
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

    if (!tips || tips.length === 0) {
        return <div className="quick-tips-gutter" />;
    }

    return (
        <div className="quick-tips-gutter">
            {tips.map((tip, index) => {
                const { icon, color } = getIcon(tip);
                return (
                    <div
                        key={index}
                        className="gutter-icon"
                        style={{ color }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <span className="icon">{icon}</span>
                        {hoveredIndex === index && (
                            <div className="gutter-tooltip">
                                {tip}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default QuickTipsGutter;

