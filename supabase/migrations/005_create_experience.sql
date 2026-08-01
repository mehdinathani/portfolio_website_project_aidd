-- Experience table
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    responsibilities TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for experience
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(order_index);
CREATE INDEX IF NOT EXISTS idx_experience_start ON experience(start_date DESC);
