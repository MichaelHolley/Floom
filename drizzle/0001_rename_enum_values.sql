UPDATE `plants` SET `light` = CASE `light`
	WHEN 'sonne' THEN 'sun'
	WHEN 'hell' THEN 'bright'
	WHEN 'halbschatten' THEN 'partialShade'
	WHEN 'schatten' THEN 'shade'
	ELSE `light`
END;--> statement-breakpoint
UPDATE `plants` SET `difficulty` = CASE `difficulty`
	WHEN 'einfach' THEN 'easy'
	WHEN 'mittel' THEN 'medium'
	WHEN 'schwer' THEN 'hard'
	ELSE `difficulty`
END;
