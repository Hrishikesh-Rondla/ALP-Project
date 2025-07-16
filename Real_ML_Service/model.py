# # FILE: model.py

# import torch
# import torch.nn as nn
# import numpy as np

# class PositionalEncoding(nn.Module):
#     """
#     Injects positional information into the input tensor.
#     The positional encodings have the same dimension as the embeddings.
#     """
#     # FIX: Changed init to the correct Python constructor _init_
#     def _init_(self, dim: int, max_len: int = 500):
#         """
#         Args:
#             dim (int): The embedding dimension.
#             max_len (int): The maximum length of the input sequences.
#         """
#         super()._init_()

#         # Create a tensor for positional encodings
#         pe = torch.zeros(max_len, dim)

#         # Create a tensor representing positions (0, 1, ..., max_len-1)
#         position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)

#         # Create the division term for the sine and cosine functions
#         div_term = torch.exp(torch.arange(0, dim, 2, dtype=torch.float) * -(np.log(10000.0) / dim))

#         # Apply sine to even indices in the tensor
#         pe[:, 0::2] = torch.sin(position * div_term)

#         # Apply cosine to odd indices in the tensor
#         pe[:, 1::2] = torch.cos(position * div_term)

#         # Register 'pe' as a buffer so it's part of the model's state,
#         # but not considered a parameter to be trained.
#         # The shape will be (1, max_len, dim) to allow for broadcasting.
#         self.register_buffer('pe', pe.unsqueeze(0))

#     # FIX: A forward pass method is just named 'forward'
#     def forward(self, x: torch.Tensor) -> torch.Tensor:
#         """
#         Adds positional encoding to the input tensor.

#         Args:
#             x (torch.Tensor): The input tensor of shape (batch_size, sequence_length, dim).

#         Returns:
#             torch.Tensor: The output tensor with positional information added.
#         """
#         # Add the positional encodings to the input tensor x
#         # self.pe is sliced to match the sequence length of x
#         return x + self.pe[:, :x.size(1)]

# class FaceEmotionTransformer(nn.Module):
#     """
#     A Transformer-based model to classify emotions from facial landmarks.
#     """
#     # FIX: Changed init to the correct Python constructor _init_
#     def _init_(self, dim: int = 128, num_heads: int = 4, ff_dim: int = 256,num_layers: int = 4, dropout: float = 0.1, num_classes: int = 7):
#         """
#         Args:
#             dim (int): The dimension of the model embeddings.
#             num_heads (int): The number of attention heads.
#             ff_dim (int): The dimension of the feed-forward network.
#             num_layers (int): The number of transformer encoder layers.
#             dropout (float): The dropout rate.
#             num_classes (int): The number of output emotion classes.
#         """
#         super()._init_()

#         # Linear projection layer to map 3D landmark coordinates to the model dimension
#         self.proj = nn.Linear(3, dim)

#         # Positional encoding module
#         self.pos_enc = PositionalEncoding(dim, max_len=468) # 468 is the number of landmarks

#         # Standard Transformer Encoder Layer
#         encoder_layer = nn.TransformerEncoderLayer(
#             d_model=dim,
#             nhead=num_heads,
#             dim_feedforward=ff_dim,
#             dropout=dropout,
#             batch_first=True # Important: ensures input is (batch, seq, feature)
#         )

#         # Stack of Transformer Encoder Layers
#         self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

#         # Layer Normalization for stability
#         self.norm = nn.LayerNorm(dim)

#         # Final fully connected layer for classification
#         self.fc = nn.Linear(dim, num_classes)

#     # FIX: A forward pass method is just named 'forward'
#     def forward(self, x: torch.Tensor) -> torch.Tensor:
#         """
#         Forward pass for the model.

#         Args:
#             x (torch.Tensor): Input tensor of facial landmarks with shape (batch_size, 468, 3).

#         Returns:
#             torch.Tensor: The output logits for each class, shape (batch_size, num_classes).
#         """
#         # Project 3D landmarks into the model's embedding dimension
#         x = self.proj(x) # Shape: (B, 468, dim)

#         # Add positional information
#         x = self.pos_enc(x) # Shape: (B, 468, dim)

#         # Pass through the transformer encoder
#         x = self.encoder(x) # Shape: (B, 468, dim)

#         # Apply layer normalization
#         x = self.norm(x) # Shape: (B, 468, dim)

#         # Use global average pooling over the sequence dimension to get a fixed-size representation
#         x = x.mean(dim=1) # Shape: (B, dim)

#         # Pass through the final classification layer
#         out = self.fc(x) # Shape: (B, num_classes)

#         return out
# FILE: model.py

import torch
import torch.nn as nn
import numpy as np

class PositionalEncoding(nn.Module):
    """
    Injects positional information into the input tensor.
    The positional encodings have the same dimension as the embeddings.
    """
    # Correct Python constructor _init_
    def __init__(self, dim: int, max_len: int = 500):
        """
        Args:
            dim (int): The embedding dimension.
            max_len (int): The maximum length of the input sequences.
        """
        super().__init__()

        # Create a tensor for positional encodings
        pe = torch.zeros(max_len, dim)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, dim, 2, dtype=torch.float) * -(np.log(10000.0) / dim))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe.unsqueeze(0))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Adds positional encoding to the input tensor.
        """
        return x + self.pe[:, :x.size(1)]

class FaceEmotionTransformer(nn.Module):
    """
    A Transformer-based model to classify emotions from facial landmarks.
    """
    # Correct Python constructor _init_
    def __init__(self, dim: int = 128, num_heads: int = 4, ff_dim: int = 256, num_layers: int = 4, dropout: float = 0.1, num_classes: int = 7):
        """
        Args:
            dim (int): The dimension of the model embeddings.
            num_heads (int): The number of attention heads.
            ff_dim (int): The dimension of the feed-forward network.
            num_layers (int): The number of transformer encoder layers.
            dropout (float): The dropout rate.
            num_classes (int): The number of output emotion classes.
        """
        super().__init__()

        self.proj = nn.Linear(3, dim)
        self.pos_enc = PositionalEncoding(dim, max_len=468)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=dim,
            nhead=num_heads,
            dim_feedforward=ff_dim,
            dropout=dropout,
            batch_first=True
        )

        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.norm = nn.LayerNorm(dim)
        self.fc = nn.Linear(dim, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for the model.
        """
        x = self.proj(x)
        x = self.pos_enc(x)
        x = self.encoder(x)
        x = self.norm(x)
        x = x.mean(dim=1)
        out = self.fc(x)
        return out