"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { ATS_CATEGORY_WEIGHTS } from '@/lib/ats-config'
import { ATSCategory } from '@/types'

interface WeightedMeterProps {
  categories: ATSCategory[]
}

export function WeightedMeter({ categories }: WeightedMeterProps) {
  // Ensure we sort categories to always match a consistent order if needed, 
  // or just render them in the order provided by the service.
  
  return (
    <div className="w-full flex flex-col gap-2" aria-label="ATS Score Breakdown">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-mist/50">
        {categories.map((cat, i) => (
          <div
            key={cat.name}
            className="h-full border-r border-background last:border-0 relative"
            style={{ width: `${cat.weight}%` }}
            title={`${cat.name}: ${cat.score}/100`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cat.score}%` }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-pine"
            />
          </div>
        ))}
      </div>
      
      <div className="flex w-full justify-between">
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            className="flex flex-col items-center flex-1"
            style={{ width: `${cat.weight}%` }}
          >
            <span className="text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-1 hidden sm:block">
              {cat.name}
            </span>
            <span className="font-system text-[10px] text-muted-foreground">
              {cat.weight}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
