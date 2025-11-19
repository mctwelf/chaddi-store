-- Insert default products into Supabase
-- Run this in Supabase SQL Editor after creating the tables

INSERT INTO products (name, description, price, original_price, category, image, rating, reviews, in_stock, featured) VALUES
('سيروم فيتامين سي المضيء', 'سيروم مركز بفيتامين سي النقي يعمل على توحيد لون البشرة وإضفاء الإشراق والنضارة', 299, 399, 'عناية بالبشرة', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', 4.8, 234, true, true),

('كريم الريتينول الليلي', 'كريم ليلي غني بالريتينول لتقليل التجاعيد وتحسين ملمس البشرة', 349, 449, 'عناية بالبشرة', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80', 4.9, 189, true, true),

('ماسك الطين المغربي', 'قناع طبيعي من الطين المغربي لتنظيف عميق وتنقية المسام', 179, 249, 'أقنعة الوجه', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80', 4.7, 156, true, true),

('زيت الأرغان المغربي', 'زيت أرغان نقي 100% لترطيب وتغذية الشعر وإضفاء اللمعان', 259, 329, 'عناية بالشعر', 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&q=80', 4.6, 201, true, false),

('مجموعة العناية بالبشرة', 'مجموعة متكاملة للعناية اليومية بالبشرة تحتوي على منظف، تونر، وكريم مرطب', 599, 799, 'مجموعات', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80', 4.9, 312, true, true),

('واقي شمس SPF 50', 'واقي شمس خفيف الملمس بحماية عالية ضد الأشعة فوق البنفسجية', 189, 249, 'عناية بالبشرة', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80', 4.8, 178, true, false),

('مرطب حمض الهيالورونيك', 'كريم مرطب غني بحمض الهيالورونيك لترطيب عميق ونعومة فائقة', 279, 349, 'عناية بالبشرة', 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=80', 4.7, 145, true, false),

('شامبو الكيراتين', 'شامبو غني بالكيراتين لتقوية الشعر وحمايته من التلف', 199, 269, 'عناية بالشعر', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80', 4.5, 167, true, false),

('بلسم الشعر المغذي', 'بلسم مغذي لترطيب الشعر وتسهيل تصفيفه', 189, 249, 'عناية بالشعر', 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=500&q=80', 4.6, 134, true, false),

('مقشر الوجه اللطيف', 'مقشر لطيف يزيل خلايا الجلد الميتة ويمنح البشرة نعومة ونضارة', 159, 219, 'عناية بالبشرة', 'https://images.unsplash.com/photo-1556228852-80c3b5e37b6e?w=500&q=80', 4.7, 198, true, false),

('ماء الورد الطبيعي', 'تونر طبيعي من ماء الورد لتنعيم وترطيب البشرة', 129, 179, 'تونر', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80', 4.8, 223, true, true),

('كريم العين المضاد للهالات', 'كريم مخصص لمنطقة العين يقلل الهالات السوداء والانتفاخ', 229, 299, 'عناية بالبشرة', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80', 4.6, 142, true, false);

-- Verify the insert
SELECT COUNT(*) as total_products FROM products;
SELECT * FROM products WHERE featured = true;
