-- Insert products from category pages into the database
-- All products will be marked as 'Sold' and inc_products_page = true
-- Using sequential IDs starting from 1212
-- Dimensions are parsed from the size field

-- Cutting Boards (1212-1220)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1212', '3D Waffle End Grain Board', 'cutting-boards', '12" x 18" x 1.5"', 'The 3D Waffle End Grain Board is made with a dark, medium, and light wood to create the 3D illusion.', 32500, 'Sold', '["/images/cutting-boards/eg-waffle.jpeg"]'::jsonb, true, 0, false, 5.0, 18, 12, 1.5),
  ('1213', 'Weave End Grain Board', 'cutting-boards', '12" x 18" x 1.5"', 'The Weave End Grain Board is made with two contrasting woods to give the illusion of a weave though all lines are straight.', 22500, 'Sold', '["/images/cutting-boards/eg-cherry-maple.jpeg"]'::jsonb, true, 0, false, 5.0, 18, 12, 1.5),
  ('1214', 'Chess Board End Grain Board', 'cutting-boards', '18.75" x 19" x 2"', 'Classic chess board pattern with alternating light and dark woods. Perfect for everyday use and makes a beautiful display piece.', 29500, 'Sold', '["/images/cutting-boards/eg-chess-board.jpeg"]'::jsonb, true, 0, false, 7.0, 19, 18.75, 2),
  ('1215', 'Brick & Mortar End Grain Board', 'cutting-boards', '12" x 18" x 1.5"', 'Classic walnut and maple brick and mortar cutting board.', 25000, 'Sold', '["/images/cutting-boards/brick-mortar.jpeg"]'::jsonb, true, 0, false, 5.0, 18, 12, 1.5),
  ('1216', 'Chaos End Grain Board', 'cutting-boards', '12" x 18" x 1.5"', 'The Chaos board is made from various woods.', 32500, 'Sold', '["/images/cutting-boards/eg-chaos.jpeg"]'::jsonb, true, 0, false, 5.0, 18, 12, 1.5),
  ('1217', 'Optical Illusion End Grain Board', 'cutting-boards', '16" x 16" x 1.5"', 'The Optical Illusion End Grain Board is made with three contrasting woods to give the illusion of depth.', 20000, 'Sold', '["/images/cutting-boards/eg-opt-warp.jpeg"]'::jsonb, true, 0, false, 4.0, 16, 16, 1.5),
  ('1218', 'Stair Step Side Grain Board', 'cutting-boards', '16" x 16" x 1.5"', 'The Stair Step Side Grain Board is made with contrasting woods to highlight the stair step pattern.', 13000, 'Sold', '["/images/cutting-boards/step-board.jpeg"]'::jsonb, true, 0, false, 4.0, 16, 16, 1.5),
  ('1219', 'Zig-Zag End Grain Board', 'cutting-boards', '16" x 16" x 1.5"', 'Zig-zag pattern with alternating light and dark woods. Perfect for everyday use and makes a beautiful display piece.', 18000, 'Sold', '["/images/cutting-boards/zigzag.jpeg"]'::jsonb, true, 0, false, 4.0, 16, 16, 1.5),
  ('1220', 'End Grain Board', 'cutting-boards', '10" x 11" x 1"', 'End grain board perfect for cutting fresh vegetables..', 8500, 'Sold', '["/images/cutting-boards/maple-walnut.jpeg"]'::jsonb, true, 0, false, 2.0, 11, 10, 1);

-- Game Boards (1221-1225)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1221', 'Chess Board', 'game-boards', '18" x 18"', 'Traditional chess board with contrasting woods and smooth finish.', 12500, 'Sold', '["/images/game-boards/gb-chess-wal-map.jpeg"]'::jsonb, true, 0, false, 3.0, 18, 18, 0.5),
  ('1222', 'Mini Chess Board', 'game-boards', '6" x 6"', 'Laser engraved small chess board and pieces - perfect for practicing!', 5000, 'Sold', '["/images/game-boards/mini-chess.jpeg"]'::jsonb, true, 0, false, 0.5, 6, 6, 0.5),
  ('1223', 'Morris Board', 'game-boards', '9" x 9"', 'Classic strategy play—place, move, and ''mill'' three-in-a-row to remove your opponent''s pieces', 7500, 'Sold', '["/images/game-boards/IMG_5484.jpeg"]'::jsonb, true, 0, false, 1.0, 9, 9, 0.5),
  ('1224', 'Cribbage Board - Multiple Woods', 'game-boards', '16" x 5"', 'Multiple wood cribbage board with pegs and cards.', 6000, 'Sold', '["/images/game-boards/gb-cb-mult.jpeg"]'::jsonb, true, 0, false, 0.75, 16, 5, 0.5),
  ('1225', 'Cribbage Board', 'game-boards', '16" x 5"', 'Single wood cribbage board with pegs and cards.', 5000, 'Sold', '["/images/game-boards/gb-cribbage.jpeg"]'::jsonb, true, 0, false, 0.75, 16, 5, 0.5);

-- Cheese Boards (1226-1230)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1226', 'Chaos End Grain Cheese Board', 'cheese-boards', '9" x 5.75" x 1"', 'Unique and one of a kind end grain cheese board.', 12500, 'Sold', '["/images/cheese-boards/cbeg-chaos.jpeg"]'::jsonb, true, 0, false, 1.0, 9, 5.75, 1),
  ('1227', 'Chaos End Grain Cheese Board', 'cheese-boards', '9" x 5.75" x 1"', 'Unique and one of a kind end grain cheese board.', 10000, 'Sold', '["/images/cheese-boards/eg-chaos.jpeg"]'::jsonb, true, 0, false, 1.0, 9, 5.75, 1),
  ('1228', 'Striped Cheese Board', 'cheese-boards', '9" x 5.75" x 1"', 'Beautiful striped pattern made with bloodwood, beech, cherry, and walnut.', 6500, 'Sold', '["/images/cheese-boards/cb-bld-wal-bch.jpeg"]'::jsonb, true, 0, false, 1.0, 9, 5.75, 1),
  ('1229', 'Cheese Board', 'cheese-boards', '9" x 5.75" x 1"', 'Single wood cheese board.', 5000, 'Sold', '["/images/cheese-boards/cb-cherry.jpeg"]'::jsonb, true, 0, false, 1.0, 9, 5.75, 1),
  ('1230', 'Charcuterie Board', 'cheese-boards', '15" x 7" x 1"', 'Single wood charcuterie board.', 6000, 'Sold', '["/images/cheese-boards/char-maple.jpeg"]'::jsonb, true, 0, false, 2.0, 15, 7, 1);

-- Coasters (1231-1234)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1231', 'Custom Engraved Coasters with Holder', 'coasters', '4" x 4" each', 'Personalized with your design, logo, or monogram.', 5000, 'Sold', '["/images/coasters/IMG_5409.jpeg"]'::jsonb, true, 0, false, 0.75, 4, 4, 0.5),
  ('1232', 'Coaster Set with Holder', 'coasters', '4" x 4" each', 'Set of four matching coasters with beautiful wooden holder. Protects surfaces while adding natural beauty to your home.', 4500, 'Sold', '["/images/coasters/goncalo-box.jpeg"]'::jsonb, true, 0, false, 0.75, 4, 4, 0.5),
  ('1233', 'Custom Engraved Coasters', 'coasters', '4" x 4" each', 'Personalized with your design, logo, or monogram.', 3000, 'Sold', '["/images/coasters/silverback.jpeg"]'::jsonb, true, 0, false, 0.5, 4, 4, 0.5),
  ('1234', 'Coaster Set (4)', 'coasters', '4" x 4" each', 'Set of four coasters - single wood.', 2000, 'Sold', '["/images/coasters/goncalo-alves-stack.jpeg"]'::jsonb, true, 0, false, 0.5, 4, 4, 0.5);

-- Outdoor Items (1235-1236)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1235', 'Fishing Net', 'outdoor-items', '10.5" x 30.5" x .75"', 'Durable outdoor net with environmentally friendly netting and magnetic clip.', 19000, 'Sold', '["/images/outdoor-items/IMG_6584.jpeg"]'::jsonb, true, 0, false, 1.5, 30.5, 10.5, 0.75),
  ('1236', 'Cigar Caddy', 'outdoor-items', '2" x 4"', 'Magnetic cigar caddy to keep your cigar dry and at your fingertips.', 2000, 'Sold', '["/images/outdoor-items/IMG_3603.jpeg"]'::jsonb, true, 0, false, 0.25, 4, 2, 1);

-- Furniture (1237-1239)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1237', 'Butcher Block Table', 'furniture', 'Custom', 'Solid hardwood butcher block table with a thick end-grain top, sturdy tapered legs, and a hand-rubbed finish — built for daily prep and decades of use.', 200000, 'Sold', '["/images/furniture/bb-table.jpeg"]'::jsonb, true, 0, false, 80.0, 60, 36, 30),
  ('1238', 'Dining Room Table', 'furniture', 'Custom', 'Solid mahogany table with maple and ebony inlay. Metal legs provided by flowyline design.', 300000, 'Sold', '["/images/furniture/tab-mah-map-ebo.jpeg"]'::jsonb, true, 0, false, 150.0, 96, 42, 30),
  ('1239', 'Side Table', 'furniture', 'Custom', 'Solid hardwood side table with a lower shelf, square plug accents, and a hand-rubbed finish — clean, sturdy, and timeless.', 25000, 'Sold', '["/images/furniture/IMG_6742.jpeg"]'::jsonb, true, 0, false, 20.0, 24, 18, 18);

-- Bar Ware (1240-1244)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1240', 'Ashtray', 'bar-ware', '6" x 6"', 'Walnut ashtray with stone inset. Can be made to hold 2 or 4 cigars.', 6500, 'Sold', '["/images/bar-ware/ashtray-walnut.jpeg"]'::jsonb, true, 0, false, 0.5, 6, 6, 1),
  ('1241', 'Wine Bottle Stopper', 'bar-ware', 'Varies', 'Handturned solid wood with unique grain pattern. All bottle stops are made with Niles stainless steel stoppers.', 2500, 'Sold', '["/images/bar-ware/bs-bocote.jpeg"]'::jsonb, true, 0, false, 0.1, 4, 2, 2),
  ('1242', 'Wine Bottle Stopper (Laminate)', 'bar-ware', 'Varies', 'Handturned laminate with unique grain pattern. All bottle stops are made with Niles stainless steel stoppers.', 2500, 'Sold', '["/images/bar-ware/bs-lam-blue.jpeg"]'::jsonb, true, 0, false, 0.1, 4, 2, 2),
  ('1243', 'Wine Caddie', 'bar-ware', '4" x 12"', 'Easily carry your bottle of wine and 2 glasses wherever you want to enjoy a glass.', 4500, 'Sold', '["/images/bar-ware/Mahogany Wine Caddy.jpeg"]'::jsonb, true, 0, false, 1.5, 12, 4, 6),
  ('1244', 'Can Opener', 'bar-ware', 'Varies', 'Perfect for opening cans of cat food!', 2500, 'Sold', '["/images/bar-ware/can-opener.jpeg"]'::jsonb, true, 0, false, 0.5, 6, 3, 1);
